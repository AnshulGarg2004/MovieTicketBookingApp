'use client'

import BlurCircle from "@/components/blur-circle";
import Loading from "@/components/loading";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BookingProps {
  _id: string;
  movieTitle: string;
  duration: string;
  showDateTime: string;
  isPaid: boolean;
  ticketQty: number;
  seats: string[];
  movieImage: string;
  cost: number;
  paymentLink?: string;
}

const Booking = () => {
  const [bookings, setBookings] = useState<BookingProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("😒 Please login first");
      } else {
        toast.error("Failed to fetch booking details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="relative px-6 md:px-16 lg:px-32 pt-32 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0" right="200px" />

      <h1 className="text-3xl font-bold mt-10 mb-10 text-center">
        My Bookings
      </h1>

      {bookings.length === 0 && (
        <p className="text-center text-gray-400">No bookings found</p>
      )}

      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="flex flex-col md:flex-row justify-between border border-rose-500/20
          bg-gradient-to-r from-purple-500 to-pink-500/10 rounded-lg mt-5 p-4"
        >
          <div className="flex gap-4">
            <Image
              src={booking.movieImage}
              width={120}
              height={80}
              alt={booking.movieTitle}
              className="rounded object-cover"
            />

            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">
                {booking.movieTitle}
              </h2>
              <p className="text-sm text-gray-400">
                {booking.duration}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(booking.showDateTime).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:text-right gap-2 mt-4 md:mt-0">
            <p className="text-xl font-semibold">₹{booking.cost}</p>

            {!booking.isPaid && booking.paymentLink && (
              <Link href={booking.paymentLink} className="bg-rose-500 hover:bg-rose-600 px-4 py-2 text-sm rounded-full">
                Pay Now
              </Link>
            )}

            <div className="text-sm text-gray-300">
              <p>Tickets: {booking.ticketQty}</p>
              <p>Seats: {booking.seats.join(", ")}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Booking;
