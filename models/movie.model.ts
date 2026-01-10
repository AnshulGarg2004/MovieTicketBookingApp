import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    trailer: {
        type: String,
        required: false,
    },
    // rating may come from TMDB as vote_average
    rating: {
        type: Number,
        required: false,
    },
    // allow multiple genres
    genre: {
        type: [String],
        required: false,
    },
    release: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    cbf: {
        type: String,
        required: false,
    },
    // runtime in minutes
    duration: {
        type: Number,
        required: false,
    },
    casts: {
        type: [String],
        required: false,
    },
}, { timestamps: true });

export const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);