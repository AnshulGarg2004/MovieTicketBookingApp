import connectDB from "@/config/connectDb";
import { Showtime } from "@/models/showtime.models";

export const getOccupiedSeats = async (
  showId: string
): Promise<string[]> => {
  await connectDB();

  const showData = await Showtime.findById(showId).lean<{
    occupiedSeats?: Record<string, boolean>;
  }>();

  if (!showData) {
    throw new Error("Show not found");
  }

  return Object.keys(showData.occupiedSeats ?? {});
};
