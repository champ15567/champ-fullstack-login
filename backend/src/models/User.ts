import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role: "admin" | "user";
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    unique: true,
    required: [true, "Please provide username"],
    validate: {
      async validator(value: any) {
        try {
          const user = await mongoose
            .model("User")
            .findOne({ username: value });
          return !user;
        } catch (error) {
          throw new Error("Username validation failed");
        }
      },
      message: "Username is already taken",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: [true, "Please provide a valid role"],
  },
});

UserSchema.pre("save", async function (next) {
  const user = this as IUser;

  try {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Password hashing failed"));
  }
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
