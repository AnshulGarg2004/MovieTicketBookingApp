import ConnectDb from "@/config/connectDb";
import { Showtime } from "@/models/showtime.models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDb();

    const shows = await Showtime.find()
      .populate("movie")
      .lean()
      .exec();

    // Deduplicate movies by _id
    const movieMap = new Map<string, any>();

    for (const show of shows) {
      if (show.movie) {
        movieMap.set(show.movie.toString(), show.movie);
      }
    }

    return NextResponse.json(
      {
        success: true,
        shows: Array.from(movieMap.values()),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
