import { Booking } from "@/models/booking.models";
import { Movie } from "@/models/movie.model";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * 🎟 Get logged-in user's bookings
 */
export const getUserBookings = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return Booking.find({ userId })
    .populate({
      path: "showtime",
      populate: { path: "movie" },
    })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * ❤️ Toggle favourite movie
 */
export const updateFavourite = async (movieId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  let favourites: string[] =
    (user.privateMetadata?.favourites as string[]) ?? [];

  if (favourites.includes(movieId)) {
    // REMOVE
    favourites = favourites.filter((id) => id !== movieId);
  } else {
    // ADD
    favourites.push(movieId);
  }

  await client.users.updateUser(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      favourites,
    },
  });

  return favourites;
};

/**
 * ❤️ Get favourite movies
 */
export const getFavourites = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const favourites: string[] =
    (user.privateMetadata?.favourites as string[]) ?? [];

  if (favourites.length === 0) return [];

  return Movie.find({ _id: { $in: favourites } }).lean();
};
