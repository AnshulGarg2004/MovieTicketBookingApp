import { Booking } from "@/models/booking.models";
import { Showtime } from "@/models/showtime.models";
import connectDB from "@/config/connectDb";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { inngest } from "@/inngest/client";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

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

    // 🔐 Clerk Auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid booking data" },
        { status: 400 }
      );
    }

    /**
     * 1️⃣ ATOMIC SEAT LOCKING (NO DOUBLE BOOKING)
     */
    const seatQuery = seats.reduce((q: any, seat: string) => {
      q[`occupiedSeats.${seat}`] = { $ne: true };
      return q;
    }, {});

    const seatUpdate = seats.reduce((u: any, seat: string) => {
      u[`occupiedSeats.${seat}`] = true;
      return u;
    }, {});

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

    if (!show) {
      return NextResponse.json(
        { success: false, message: "Selected seats already booked" },
        { status: 409 }
      );
    }

    /**
     * 2️⃣ CREATE BOOKING (AFTER SEATS ARE LOCKED)
     */
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

     const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: movieTitle,
            },
            unit_amount: Number(show.cost) * 100,
          },
          quantity: seats.length,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?bookingId=${booking._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel?bookingId=${booking._id}`,
      expires_at : Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes from now
    });

    booking.paymentLink = session.url!;
    await booking.save();

    await inngest.send({
      name : "app/checkpayment",
      data : {
        bookigId : booking._id.toString(),
      }
    })

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
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
