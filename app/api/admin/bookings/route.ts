import { NextResponse } from "next/server";
import connectDB from "@/config/connectDb";
import { protectAdmin } from "@/auth";
import { Booking } from "@/models/booking.models";

export async function GET() {
  try {
    await connectDB();

    // 🔐 Admin check
    await protectAdmin();

    const bookings = await Booking.find({})
      .populate({
        path: "showtime",
        populate: {
          path: "movie",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        bookings,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.message === "Unauthorized" ? 401 : 403 }
    );
  }
}
