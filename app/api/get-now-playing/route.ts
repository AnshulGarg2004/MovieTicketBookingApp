import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'

export async function GET(req: NextRequest) {
    try {
        if (!process.env.TMDB_API_KEY) {
            return NextResponse.json({ status: 400, message: "TMDB_API_KEY not configured" }, { status: 400 });
        }

        const { data } = await axios.get("https://api.themoviedb.org/3/movie/popular", {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })

        const movies = data.results;
        return NextResponse.json({ status: 200, message: "Movies fetched successfully", movies });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error.message })
    }
}
