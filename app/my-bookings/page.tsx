'use client'
import BlurCircle from "@/components/blur-circle";
import Loading from "@/components/loading";
import { bookingData } from "@/data/booking";
import Image from "next/image";
import { useEffect, useState } from "react"

interface BookingProps {
    id: number,
    title: string,
    duration: string,
    dateTime: string,
    isPaid: boolean,
    ticketQty: number,
    seats: string[],
    image: string,
    cost: string
}

const Booking = () => {
    const [bookings, setBookings] = useState<BookingProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => { setBookings(bookingData); setIsLoading(false) }, []);
    return !isLoading ? (
        <div className="relative px-6 md:px-16 lg:px-32 pt-30 md:pt-40 min-h-[80vh]">
            <BlurCircle top="100px" left="100px" />
            <div>
                <BlurCircle bottom="0" right="200px" />
            </div>
            <h1 className="text-3xl font-bold mt-10 mb-10 text-center">My Bookings</h1>
            {
                bookings.map((booking, index) => (
                    <div key={index} className="flex flex-col md:flex-row justify-between border border-rose-500/20 bg-gradient-to-r from-purple-500 to-pink-500/10 rounded-lg mt-5 p-2 px-5 py-3">
                        <div className="flex flex-col md:flex-row">
                            <Image src={booking.image} width={20} height={20} alt={booking.title} className=" w-20 md:max-w-45 aspect-video h-auto object-cover object-center rounded" />
                            <div className="flex gap-2 p-4 flex-col">
                                <h1 className="text-lg font-semibold">{booking.title}</h1>
                                <p className="text-gray-400 text-sm">{booking.duration}</p>
                                <p className="text-gray-400 text-sm mt-auto">{booking.dateTime}</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                            <div className="flex items-center gap-4">
                                <p className="text-2xl font-semibold mb-4">{booking.cost}</p>
                                { !booking.isPaid && <button className="bg-rose-500 px-4 py-2 cursor-pointer hover:bg-red-700 mb-3 text-sm font-medium rounded-full">Pay Now</button>}
                            </div>

                            <div className="text-sm">
                                <p><span className="text-gray-400 px-2">Ticket purchased: </span> {booking.ticketQty}</p>
                                <p><span className="text-gray-400 px-2">Seat Number: </span> {booking.seats}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    ) : (
        <Loading />
    )
}

export default Booking