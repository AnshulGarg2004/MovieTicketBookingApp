import mongoose, { Schema, models, model } from "mongoose";

const bookingSchema = new Schema(
  {
    // 🔗 Relations
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    showtime: {
      type: Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },

    // 👤 User (Clerk / Auth)
    userId: {
      type: String, // Clerk userId
      required: true,
    },

    // 🎟 Ticket info
    ticketQty: {
      type: Number,
      required: true,
      min: 1,
    },

    seats: {
      type: [String], // ['A1', 'A2']
      required: true,
    },

    // 💰 Payment
    isPaid: {
      type: Boolean,
      default: false,
    },

    paymentLink : {
        type : String,
    },

    cost: {
      type: Number, // store as number, not ₹ string
      required: true,
    },

    // 🕒 Snapshot fields (for history)
    movieTitle: {
      type: String,
      required: true,
    },

    movieImage: {
      type: String,
      required: true,
    },

    duration: {
      type: String, // "1h 46min"
      required: true,
    },

    showDateTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Booking =  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
