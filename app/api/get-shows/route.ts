import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'
import ConnectDb from "@/config/connectDb";
import { Showtime } from "@/models/showtime.models";

export async function GET() {
  try {
    console.log("Starting get-shows API...");
    
    await ConnectDb();
    console.log("Database connected successfully");

    // Get shows from database only
    const shows = await Showtime.find()
      .populate("movie")
      .lean()
      .exec();

    console.log(`Found ${shows.length} shows in database`);

    // Only show movies that have been added to database with showtimes
    const movieMap = new Map<string, any>();

    for (const show of shows) {
      if (show.movie && show.movie._id) {
        const movie = {
          ...show.movie,
          id: show.movie._id.toString(),
          hasShows: true
        };
        movieMap.set(show.movie._id.toString(), movie);
      }
    }

    const movies = Array.from(movieMap.values());
    console.log(`Returning ${movies.length} movies with shows from database`);

    return NextResponse.json(
      {
        success: true,
        Show: movies.map(movie => ({ movie })),
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error in get-shows API:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}




