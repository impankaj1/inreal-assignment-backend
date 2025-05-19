import z from "zod";
import { JobType } from "../models/User";

export const JobCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  salary: z.number().min(1),
  jobType: z.nativeEnum(JobType),
  company: z.string().min(1),
});
