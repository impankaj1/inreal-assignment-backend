import { ZodError } from "zod";
import { JobCreateDTO, JobUpdateDTO } from "../models/Jobs";
import { JobCreateSchema } from "../validators/JobValidator";
import { Request, Response } from "express";
import jobService from "../services/JobService";
import userService from "../services/UserService";
import mongoose from "mongoose";

class JobController {
  private static _instance: JobController;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new JobController();
    }
    return this._instance;
  }

  public async getJobs(req: Request, res: Response): Promise<any> {
    const jobs = await jobService.getJobs();
    return res.status(200).json(jobs);
  }

  public async getJobById(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const job = await jobService.getJobById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json(job);
  }

  public async createJob(req: Request, res: Response): Promise<any> {
    let data: JobCreateDTO = req.body;

    try {
      data = JobCreateSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(403)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Internal server error" });
    }

    const job = await jobService.createJob(data);
    return res.status(201).json(job);
  }

  public async updateJob(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const data: JobUpdateDTO = req.body;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const job = await jobService.updateJob(id, data);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json(job);
  }

  public async deleteJob(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const job = await jobService.deleteJob(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json({ message: "Job deleted successfully" });
  }

  public async findUserMatches(req: Request, res: Response): Promise<any> {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobs = await jobService.getJobs();
    if (jobs.length < 3) {
      return res.status(200).json(jobs);
    }

    const matches = await jobService.findUserMatches(user, jobs);
    return res.status(200).json(matches);
  }
}

const jobController = JobController.getInstance();

export default jobController;
