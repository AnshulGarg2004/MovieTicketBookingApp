import { NextResponse } from "next/server";
import connectDB from "@/config/connectDb";
import { protectAdmin } from "@/auth";
import { getDashboardData } from "@/utils/ifAdmin";

export async function GET() {
  try {
    await connectDB();
    await protectAdmin(); // 🔐 admin check

    const data = await getDashboardData();

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 403 }
    );
  }
}
