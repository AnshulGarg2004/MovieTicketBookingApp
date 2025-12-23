import { Booking } from "@/models/booking.models";
import { Showtime } from "@/models/showtime.models";
import { User } from "@/models/user.models";

/**
 * 📊 Dashboard summary
 */
export const getDashboardData = async () => {
  try {
    const bookings = await Booking.find({ isPaid: true }).lean();

    const activeShows = await Showtime.find({
      dateTime: { $gte: new Date() },
    })
      .populate("movie")
      .lean();

    const totalUsers = await User.countDocuments();

    return {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce(
        (acc, curr) => acc + Number(curr.cost),
        0
      ),
      totalActiveShows: activeShows.length,
      totalUsers,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * 🎬 All upcoming shows
 */
export const getAllShows = async () => {
  try {
    const shows = await Showtime.find({
      dateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ dateTime: 1 })
      .lean();

    return shows;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * 🎟 All bookings (admin)
 */
export const getAllBookings = async () => {
  try {
    const bookings = await Booking.find({})
      .populate({
        path: "showtime",
        populate: {
          path: "movie",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return bookings;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
