import { Showtime } from "@/models/showtime.models";

export const checkSeatAvailability = async (
  showId: string,
  selectedSeats: string[]
): Promise<boolean> => {
  const show = await Showtime.findById(showId).lean();

  if (!show) {
    throw new Error("Show not found");
  }

  const occupiedSeats = show.occupiedSeats || {};

  // Check if any selected seat is already occupied
  const isAnySeatTaken = selectedSeats.some(
    // @ts-ignore
    (seat : string) => occupiedSeats[seat] === true
  );

  return !isAnySeatTaken;
};
