import mongoose, { Schema } from "mongoose";

const showtimeSchema = new mongoose.Schema({
        movie: {
            type: String,
            required: true,
            ref: 'Movie'
        },
        dateTime: {
            type: Date,
            required: true
        },
        cost: {
            type: Number,
            required: true
        },
        occupiedSeats: {
            type: Map,
            of: Boolean,
            default: {}
        },
}, {minimize : false, timestamps : true});

export const Showtime = mongoose.models.Showtime || mongoose.model("Showtime", showtimeSchema);