import { z } from "zod";
import { JobType } from "../models/User";

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
  skills: z
    .array(z.string({ message: "Skills are required" }))
    .min(1, "Skills are required"),
  location: z.string().min(1, "Location is required"),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email id")
    .nonempty("Email is required"),
  password: z.string().min(8, "Password should be at least 8 characters"),
});
