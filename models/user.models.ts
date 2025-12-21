import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
