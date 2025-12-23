import { NextResponse } from "next/server";
import connectDB from "@/config/connectDb";
import { getUserBookings } from "@/utils/user";

export async function GET() {
  try {
    await connectDB();

    const bookings = await getUserBookings();

    return NextResponse.json(
      { success: true, bookings },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
