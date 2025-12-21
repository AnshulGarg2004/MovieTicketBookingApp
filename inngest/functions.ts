import { User } from "../models/user.models";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "clerk/user.created" },
  async ({ event }) => {
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
