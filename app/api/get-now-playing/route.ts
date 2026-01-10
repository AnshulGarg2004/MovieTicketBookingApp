import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'

export async function GET() {
    try {
        console.log("Starting get-now-playing API...");
        
        if (!process.env.TMDB_API_KEY) {
            console.error("TMDB_API_KEY not found");
            return NextResponse.json({ success: false, message: "TMDB_API_KEY not configured" }, { status: 400 });
        }

        console.log("Fetching from TMDB...");
        const { data } = await axios.get("https://api.themoviedb.org/3/movie/popular", {
            params: { api_key: process.env.TMDB_API_KEY }
        })

        console.log("TMDB response received");
        const movies = data.results.slice(0, 20).map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg',
            rating: movie.vote_average || 0,
            release: movie.release_date || 'Unknown',
            description: movie.overview || 'No description available'
        }));
        
        console.log(`Returning ${movies.length} movies`);
        return NextResponse.json({ success: true, movie: movies });

    } catch (error: any) {
        console.error("Error in get-now-playing:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
