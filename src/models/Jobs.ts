import mongoose, { Types } from "mongoose";
import { JobType } from "./User";
import { JobCreateSchema } from "../validators/JobValidator";
import z from "zod";

export interface Job {
  _id: Types.ObjectId;
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: string;
  company: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    company: { type: String, required: true },
    jobType: { type: String, enum: JobType, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const JobModel = mongoose.model("Job", JobSchema);

export default JobModel;

export type JobCreateDTO = z.infer<typeof JobCreateSchema>;

export type JobUpdateDTO = Partial<JobCreateDTO>;
