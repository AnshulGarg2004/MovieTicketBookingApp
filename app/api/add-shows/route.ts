import { Movie } from "@/models/movie.model";
import { Showtime } from "@/models/showtime.models";
import connectDB from "@/config/connectDb";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { inngest } from "@/inngest/client";

interface ShowInput {
  date: string;
  time: string[];
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log("Add shows API called");

    const { movieId, showInput, showPrice } = await req.json();
    console.log("Received data:", { movieId, showInput, showPrice });

    if (!movieId || !Array.isArray(showInput) || !showPrice) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    // Find or create movie
    let movie = await Movie.findOne({ tmdbId: movieId.toString() });
    console.log("Existing movie found:", !!movie);

    if (!movie) {
      if (!process.env.TMDB_API_KEY) {
        return NextResponse.json(
          { success: false, message: "TMDB_API_KEY not configured" },
          { status: 500 }
        );
      }

      try {
        console.log(`Fetching movie ${movieId} from TMDB...`);
        const [movieDetailRes, movieCreditRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { api_key: process.env.TMDB_API_KEY }
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: { api_key: process.env.TMDB_API_KEY }
          }),
        ]);

        const movieApiData = movieDetailRes.data;
        const movieCreditData = movieCreditRes.data;
        console.log("TMDB data received for:", movieApiData.title);

        movie = await Movie.create({
          tmdbId: movieId.toString(),
          title: movieApiData.title,
          description: movieApiData.overview,
          duration: movieApiData.runtime,
          release: movieApiData.release_date,
          casts: movieCreditData.cast
            .slice(0, 5)
            .map((cast: any) => cast.name),
          image: `https://image.tmdb.org/t/p/w500${movieApiData.poster_path}`,
          genre: movieApiData.genres.map((g: any) => g.name),
          rating: movieApiData.vote_average,
        });
        console.log(`Created movie: ${movie.title}`);
      } catch (tmdbError: any) {
        console.error("TMDB API error:", tmdbError.message);
        return NextResponse.json(
          { success: false, message: `TMDB API error: ${tmdbError.message}` },
          { status: 500 }
        );
      }
    }

    // Create showtimes
    const showsToCreate: any[] = [];

    showInput.forEach((show: ShowInput) => {
      show.time.forEach((time) => {
        const dateTime = new Date(`${show.date}T${time}`);

        showsToCreate.push({
          movie: movie._id,
          showDateTime: dateTime,
          cost: Number(showPrice),
          occupiedSeats: {},
        });
      });
    });

    if (!showsToCreate.length) {
      return NextResponse.json(
        { success: false, message: "No shows to create" },
        { status: 400 }
      );
    }

    console.log(`Creating ${showsToCreate.length} shows...`);
    const createdShows = await Showtime.insertMany(showsToCreate);
    console.log(`Successfully created ${createdShows.length} shows`);

    return NextResponse.json(
      {
        success: true,
        message: "Showtimes added successfully",
        movie,
        shows: createdShows,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in add-shows:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
