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

    const { movieId, showInput, showPrice } = await req.json();

    if (!movieId || !Array.isArray(showInput) || !showPrice) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    /**
     * 1️⃣ FIND OR CREATE MOVIE (tmdbId stored separately)
     */
    let movie = await Movie.findOne({ tmdbId: movieId });

    if (!movie) {
      if (!process.env.TMDB_API_KEY) {
        return NextResponse.json(
          { success: false, message: "TMDB_API_KEY not configured" },
          { status: 500 }
        );
      }

      const [movieDetailRes, movieCreditRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailRes.data;
      const movieCreditData = movieCreditRes.data;

      movie = await Movie.create({
        tmdbId: movieId, // ✅ CORRECT
        title: movieApiData.title,
        description: movieApiData.overview,
        duration: movieApiData.runtime,
        release: movieApiData.release_date,
        casts: movieCreditData.cast
          .slice(0, 5)
          .map((cast: any) => cast.name),
        image: `https://image.tmdb.org/t/p/w500${movieApiData.poster_path}`,
        genre: movieApiData.genres.map((g: any) => g.name),
        vote_avg: movieApiData.vote_average,
      });
    }

    /**
     * 2️⃣ CREATE SHOWTIMES (ObjectId + correct field names)
     */
    const showsToCreate: any[] = [];

    showInput.forEach((show: ShowInput) => {
      show.time.forEach((time) => {
        const dateTime = new Date(`${show.date}T${time}`);

        showsToCreate.push({
          movie: movie._id, // ✅ ObjectId
          showDateTime: dateTime, // ✅ correct field
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

    await inngest.send({
      name : 'app/show.added',
      data : {movieTitle : movie.title}
    })

    const createdShows = await Showtime.insertMany(showsToCreate);

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
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
