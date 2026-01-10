import { Showtime } from "@/models/showtime.models";
import { Movie } from "@/models/movie.model";
import connectDB from "@/config/connectDb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import axios from "axios";

type TimeEntry = { time: string; id: string; cost: number };
type DateTimeMap = {
  [date: string]: TimeEntry[];
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: movieId } = await params;
    console.log("Fetching movie details for ID:", movieId);

    // Try to find movie by tmdbId first (for TMDB movies)
    let movie = await Movie.findOne({ tmdbId: movieId }).lean();
    
    // If not found by tmdbId, try by _id (for database movies)
    if (!movie && mongoose.Types.ObjectId.isValid(movieId)) {
      movie = await Movie.findById(movieId).lean();
    }

    if (!movie) {
      // If movie not found in database, try to fetch from TMDB
      if (!process.env.TMDB_API_KEY) {
        return NextResponse.json(
          { success: false, message: "Movie not found and TMDB_API_KEY not configured" },
          { status: 404 }
        );
      }

      try {
        console.log(`Fetching movie ${movieId} from TMDB for display...`);
        const [movieResponse, creditsResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { api_key: process.env.TMDB_API_KEY }
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: { api_key: process.env.TMDB_API_KEY }
          })
        ]);

        const movieData = movieResponse.data;
        const casts = creditsResponse.data.cast?.slice(0, 10).map((actor: any) => ({
          id: actor.id,
          name: actor.name,
          movieName: actor.character,
          image: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/placeholder-actor.jpg'
        })) || [];

        // Return TMDB movie data but indicate no shows available
        return NextResponse.json(
          {
            success: true,
            movie: {
              _id: movieData.id,
              id: movieData.id,
              tmdbId: movieData.id,
              title: movieData.title,
              description: movieData.overview,
              image: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : '/placeholder-movie.jpg',
              rating: movieData.vote_average,
              genre: movieData.genres?.map((g: any) => g.name) || [],
              release: movieData.release_date,
              duration: movieData.runtime,
              casts
            },
            shows: {}
          },
          { status: 200 }
        );
      } catch (tmdbError) {
        console.error("TMDB fetch error:", tmdbError);
        return NextResponse.json(
          { success: false, message: "Movie not found" },
          { status: 404 }
        );
      }
    }

    console.log("Found movie:", movie.title);

    // Fetch cast data from TMDB if tmdbId exists
    let casts = [];
    if (movie.tmdbId && process.env.TMDB_API_KEY) {
      try {
        const { data: creditsData } = await axios.get(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/credits`, {
          params: { api_key: process.env.TMDB_API_KEY }
        });
        
        casts = creditsData.cast?.slice(0, 10).map((actor: any) => ({
          id: actor.id,
          name: actor.name,
          movieName: actor.character,
          image: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/placeholder-actor.jpg'
        })) || [];
      } catch (error) {
        console.error("Failed to fetch cast data:", error);
      }
    }

    // Fetch showtimes for this movie
    const shows = await Showtime.find({ movie: movie._id }).lean();
    console.log(`Found ${shows.length} shows for this movie`);

    if (!shows.length) {
      return NextResponse.json(
        { success: false, message: "No shows found for this movie" },
        { status: 404 }
      );
    }

    // Group shows by date
    const dateTime: DateTimeMap = {};

    shows.forEach((show) => {
      const dateObj = new Date(show.showDateTime);

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
        movie: {
          ...movie,
          id: movie._id.toString(),
          casts
        },
        shows: Object.entries(dateTime).reduce((acc, [date, times]) => {
          acc[date] = times;
          return acc;
        }, {} as any)
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in get-shows/[id]:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
