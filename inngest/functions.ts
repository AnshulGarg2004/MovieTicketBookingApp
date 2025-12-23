import ConnectDb from "@/config/connectDb";
import { User } from "../models/user.models";
import { inngest } from "./client";
import { Booking } from "@/models/booking.models";
import { Showtime } from "@/models/showtime.models";
import { sendEmail } from "@/config/nodemailer";




export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await ConnectDb();
    console.log("Connected to database");

    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await ConnectDb();
    console.log("Connected to database");
    const { id, first_name, last_name, email_addresses } = event.data;

    await User.create({
      clerkUserId: id,
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      email: email_addresses?.[0]?.email_address,
    });
  }
);


export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-deletion" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await ConnectDb();
    console.log("Connected to database");
    const { id } = event.data;

    await User.findOneAndDelete({
      clerkUserId: id,
    });
  }
);

export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-updation" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await ConnectDb();
    console.log("Connected to database");
    const { id, first_name, last_name, email_addresses } = event.data;

    await User.findOneAndUpdate(
      { clerkUserId: id },
      {
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        email: email_addresses?.[0]?.email_address,
      },
      { new: true }
    );
  }
);


export const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "booking/payment.pending" },

  async ({ event, step }) => {
    // 1️⃣ Wait 10 minutes
    await step.sleep("wait-for-10-minutes", "10m");

    // 2️⃣ Run cleanup
    await step.run("check-payment-status", async () => {
      await ConnectDb();

      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      // ✅ Booking already deleted or paid
      if (!booking || booking.isPaid) return;

      const show = await Showtime.findById(booking.showtime);
      if (!show) {
        await Booking.findByIdAndDelete(bookingId);
        return;
      }

      // 3️⃣ Release seats
      booking.seats.forEach((seat: string) => {
        delete show.occupiedSeats[seat];
      });

      show.markModified("occupiedSeats");
      await show.save();

      // 4️⃣ Delete booking
      await Booking.findByIdAndDelete(bookingId);
    });
  }
);


export const sendConfirmationEmail = inngest.createFunction(
  { id: "send-booking-email" },
  { event: "booking/paid" }, // ✅ better event name

  async ({ event, step }) => {
    await step.run("send-confirmation-email", async () => {
      await ConnectDb();

      const { bookingId } = event.data;

      const booking = await Booking.findById(bookingId)
        .populate({
          path: "showtime",
          populate: { path: "movie", model: "Movie" },
        })
        .populate("user");

      // ✅ Safety guards
      if (!booking || !booking.user || !booking.showtime?.movie) return;

      await sendEmail({
        to: booking.user.email,
        subject: `Payment Confirmation: ${booking.showtime.movie.title} booked!`,
        body: `
          <div style="font-family: Arial, sans-serif; color:#111;">
            <p>Hi <strong>${booking.user.name}</strong>,</p>

            <p>
              🎉 Your payment was successful and your tickets for
              <strong>${booking.showtime.movie.title}</strong> are confirmed!
            </p>

            <p>
              📅 <strong>Date:</strong> ${new Date(booking.showDateTime).toLocaleDateString()}<br/>
              ⏰ <strong>Time:</strong> ${new Date(booking.showDateTime).toLocaleTimeString()}<br/>
              🎟 <strong>Seats:</strong> ${booking.seats.join(", ")}<br/>
              💰 <strong>Amount Paid:</strong> ₹${booking.cost}
            </p>

            <p>You can view your booking anytime from your account.</p>

            <p>Enjoy the movie! 🍿<br/>— ShowSphere Team</p>
          </div>
        `,
      });
    });
  }
);

export const sendShowReminders = inngest.createFunction(
  { id: 'send-show-reminder' },
  { cron: "0 */8 * * *" },
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    const reinderTasks = await step.run(
      'prepare-reminder-tasks', async () => {
        const shows = await Showtime.find({
          showTime: { $gte: windowStart, $lte: in8Hours }
        }).populate('movie');

        const tasks = [];

        for (const show of shows) {
          if (!show.movie) continue;
          const userIds = [...new Set(
            Object.values(show.occupiedSeats)
          )];
          if (userIds.length === 0) continue;

          const users = await User.find({ _id: { $in: userIds } }).select('email name');
          for (const user of users) {
            tasks.push({
              userEmail: user.email,
              userName: user.name,
              movieTitle: show.movie.title,
              showTime: show.showTime,
            });
          }
        }
        return tasks;
      }
    );

    if (reinderTasks.length === 0) {
      return { sent: 0, message: "No reminders to send" };
    }

    const results = await step.run('send-all-reminders', async () => {
      return await Promise.allSettled(
        reinderTasks.map(task => sendEmail({
          to: task.userEmail,
          subject: `Reminder : Your movie "${task.movieTitle}" starts soon`,
          body: `
        <div style="font-family: Arial, sans-serif; color:#111;">
            <p>Hi <strong>${task.userName}</strong>,</p>

            <p>
              🎉 Your payment was successful and your tickets for
              <strong>${task.showTime}</strong> are confirmed!
            </p>

            <p>You can view your booking anytime from your account.</p>

            <p>Enjoy the movie! 🍿<br/>— ShowSphere Team</p>
          </div>
        `,
        }))
      )
    })

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - sent;

    return {
      sent, failed, message: `Reminders sent: ${sent}, failed: ${failed}`
    }
  }
)


export const newShowNotification = inngest.createFunction(
  { id: 'send-new-show-notification' },
  { event: 'app/show.added' },
  async ({ event }) => {
    const { movieTitle } =event.data;
    const Users = await User.find({


    })

    for(const user of Users){
      const userEmail = user.email;
      const userName = user.name;
      const subject = `New Show Added : ${movieTitle}`
      const body = `
      <div style="font-family: Arial, sans-serif; color:#111;">
            <p>Hi <strong>${userName}</strong>,</p>
            <p> We have added a new show to our library</p>
            <h3 style="color: #F84565;">"${movieTitle}"</h3>
            <p>Thanks ShowShphere team </p> 
      </div>
      `

      await sendEmail({
      to : userEmail,
      subject,
      body
    })
    }

    return {message : "Notification sent."}

    
  })