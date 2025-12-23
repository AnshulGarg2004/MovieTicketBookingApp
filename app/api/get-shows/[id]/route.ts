import { Showtime } from "@/models/showtime.models";
import { Movie } from "@/models/movie.model";
import connectDB from "@/config/connectDb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

type TimeEntry = { time: string; id: string; cost: number };
type DateTimeMap = {
  [date: string]: TimeEntry[];
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const movieId = params.id;

    // 🔴 Convert string → ObjectId
    const movieObjectId = new mongoose.Types.ObjectId(movieId);

    // 1️⃣ Fetch showtimes correctly
    const shows = await Showtime.find({ movie: movieObjectId }).lean();

    if (!shows.length) {
      return NextResponse.json(
        { success: false, message: "No shows found" },
        { status: 404 }
      );
    }

    // 2️⃣ Fetch movie
    const movie = await Movie.findById(movieObjectId).lean();
    if (!movie) {
      return NextResponse.json(
        { success: false, message: "Movie not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Group shows by date
    const dateTime: DateTimeMap = {};

    shows.forEach((show) => {
      const dateObj = new Date(show.showDateTime); // ✅ FIXED

      const date = dateObj.toISOString().split("T")[0];
      const time = dateObj.toISOString().split("T")[1].slice(0, 5);

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({
        time,
        id: show._id.toString(),
        cost: Number(show.cost),
        });
    });

    return NextResponse.json(
      {
        success: true,
        movie,
        shows: dateTime,
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
