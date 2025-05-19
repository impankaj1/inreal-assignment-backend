import mongoose, { Types } from "mongoose";
import z from "zod";
import { LoginSchema, SignupSchema } from "../validators/UserValidator";

export enum JobType {
  REMOTE = "remote",
  HYBRID = "hybrid",
  ONSITE = "onsite",
}

export interface User {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  experience: number;
  preferred_job_type: string;
  skills: string[];
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
      required: true,
    },
    preferred_job_type: {
      type: String,
      enum: JobType,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "",
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

export type UserCreateDTO = z.infer<typeof SignupSchema>;

export type UserLoginDTO = z.infer<typeof LoginSchema>;
export type UserUpdateDTO = Partial<UserCreateDTO>;
