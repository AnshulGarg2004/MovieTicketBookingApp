import { Booking } from "@/models/booking.models";
import { Showtime } from "@/models/showtime.models";
import connectDB from "@/config/connectDb";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log("Booking API called");

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      showId,
      seats,
      movieId,
      ticketQty,
      movieTitle,
      movieImage,
      duration,
      showDateTime,
    } = await req.json();

    console.log("Booking data:", { showId, seats, movieId, ticketQty });

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid booking data" },
        { status: 400 }
      );
    }

    /**
     * 1️⃣ ATOMIC SEAT LOCKING (NO DOUBLE BOOKING)
     */
    console.log("Checking seat availability for:", seats);
    
    const seatQuery = seats.reduce((q: any, seat: string) => {
      q[`occupiedSeats.${seat}`] = { $ne: true };
      return q;
    }, {});

    const seatUpdate = seats.reduce((u: any, seat: string) => {
      u[`occupiedSeats.${seat}`] = true;
      return u;
    }, {});

    console.log("Seat query:", seatQuery);
    console.log("Seat update:", seatUpdate);

    const show = await Showtime.findOneAndUpdate(
      {
        _id: showId,
        ...seatQuery,
      },
      {
        $set: seatUpdate,
      },
      { new: true }
    ).lean();

    console.log("Show found:", !!show);

    if (!show) {
      return NextResponse.json(
        { success: false, message: "Selected seats already booked" },
        { status: 409 }
      );
    }

    /**
     * 2️⃣ CREATE BOOKING (AFTER SEATS ARE LOCKED)
     */
    console.log("Creating booking with data:", {
      movie: movieId,
      showtime: showId,
      userId,
      ticketQty,
      seats,
      cost: Number(show.cost) * seats.length
    });
    
    const booking = await Booking.create({
      movie: movieId,
      showtime: showId,
      userId,
      ticketQty,
      seats,
      cost: Number(show.cost) * seats.length,
      isPaid: false,
      movieTitle,
      movieImage,
      duration,
      showDateTime,
    });

    console.log("Booking created:", booking._id);
    console.log("Creating Stripe session with cost:", Number(show.cost));

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

     const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: movieTitle || "Movie Ticket",
            },
            unit_amount: Number(show.cost) * 100,
          },
          quantity: seats.length,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-bookings`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/movies`,
      expires_at : Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
    });

    console.log("Stripe session created:", session.id);
    console.log("Stripe URL:", session.url);

    booking.paymentLink = session.url!;
    await booking.save();

    return NextResponse.json(
      {
        success: true,
        message: "Booking successful",
        url : session.url,
        booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking API error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
