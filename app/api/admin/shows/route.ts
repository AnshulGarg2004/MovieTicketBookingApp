import { NextResponse } from "next/server";
import connectDB from "@/config/connectDb";
import { Showtime } from "@/models/showtime.models";
import { protectAdmin } from "@/auth";

export async function GET() {
  try {
    await connectDB();

    // 🔐 Admin authorization
    await protectAdmin();

    const shows = await Showtime.find({
      dateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ dateTime: 1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        shows,
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
