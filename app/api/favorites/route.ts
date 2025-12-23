import { NextResponse } from "next/server";
import connectDB from "@/config/connectDb";
import { getFavourites, updateFavourite } from "@/utils/user";

/**
 * GET → Fetch user's favourite movies
 */
export async function GET() {
  try {
    await connectDB();

    const movies = await getFavourites();

    return NextResponse.json(
      { success: true, movies },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

/**
 * POST → Toggle favourite (add/remove)
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const { movieId } = await req.json();
    if (!movieId) {
      return NextResponse.json(
        { success: false, message: "movieId is required" },
        { status: 400 }
      );
    }

    const favourites = await updateFavourite(movieId);

    return NextResponse.json(
      { success: true, favourites },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
