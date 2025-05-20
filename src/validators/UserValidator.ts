import { z } from "zod";
import { JobType, Role } from "../models/User";

export const SignupSchema = z.object({
  name: z
    .string({ message: "Please enter your name" })
    .min(1, "Name is required"),
  email: z
    .string()
    .email("Please enter a valid email id")
    .nonempty("Email is required"),
  password: z.string().min(8, "Password should be at least 8 characters"),
  experience: z.number().min(0, "Experience is required"),
  preferred_job_type: z.nativeEnum(JobType),
  skills: z.array(z.string()).optional(),
  location: z.string().min(1, "Location is required"),
  role: z.nativeEnum(Role),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email id")
    .nonempty("Email is required"),
  password: z.string().min(8, "Password should be at least 8 characters"),
});
