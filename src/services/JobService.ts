import JobModel, { Job, JobCreateDTO, JobUpdateDTO } from "../models/Jobs";
import { User } from "../models/User";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class JobService {
  private static _instance: JobService;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new JobService();
    }
    return this._instance;
  }

  public async getJobs(): Promise<Job[]> {
    const jobs = await JobModel.find();
    return jobs;
  }

  public async getJobsByUser(userId: string): Promise<Job[]> {
    const jobs = await JobModel.find({ createdBy: userId });
    return jobs;
  }

  public async getJobById(id: string): Promise<Job | null> {
    const job = await JobModel.findById(id);
    return job ? job.toObject() : null;
  }

  public async createJob(job: JobCreateDTO) {
    const newJob = await JobModel.create(job);
    return newJob.toObject();
  }

  public async updateJob(id: string, job: JobUpdateDTO): Promise<Job | null> {
    const updatedJob = await JobModel.findByIdAndUpdate(id, job, { new: true });
    return updatedJob ? updatedJob.toObject() : null;
  }

  public async deleteJob(id: string): Promise<boolean> {
    const deletedJob = await JobModel.findByIdAndDelete(id);
    return deletedJob !== null;
  }

  public async findUserMatches(user: User, jobs: Job[]): Promise<Job[]> {
    try {
      const prompt = `Given the following user profile and available jobs, return a JSON array of job IDs that best match the user's profile. Consider the user's skills, experience, preferred job type, and location.

User Profile:
- Skills: ${user.skills?.join(", ") || "No skills provided"}
- Experience: ${user.experience} years
- Preferred Job Type: ${user.preferred_job_type}
- Location: ${user.location}

Available Jobs:
${jobs
  .map(
    (job) => `
Job ID: ${job._id}
Title: ${job.title}
Description: ${job.description}
Location: ${job.location}
Job Type: ${job.jobType}
Salary: ${job.salary}
Company: ${job.company}
`
  )
  .join("\n")}

Return a JSON array of exactly 3 job IDs that best match the user's profile, ordered by relevance. Example format: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              'You are a job matching assistant. Your task is to analyze user profiles and job listings to find the best matches. Return only a JSON array of exactly 3 job IDs in the format: ["id1", "id2", "id3"]',
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        console.error("No response from OpenAI");
        return jobs.slice(0, 3);
      }

      try {
        // Clean the response string to ensure it's valid JSON
        const cleanResponse = response.trim().replace(/[\n\r]/g, "");
        const matchedJobIds = JSON.parse(cleanResponse);

        // Validate that we got an array of strings
        if (
          !Array.isArray(matchedJobIds) ||
          !matchedJobIds.every((id) => typeof id === "string")
        ) {
          console.error("Invalid response format from OpenAI");
          return jobs.slice(0, 3);
        }

        const matchedJobs = jobs.filter((job) =>
          matchedJobIds.includes(job._id.toString())
        );

        if (matchedJobs.length < 3) {
          const remainingJobs = jobs.filter(
            (job) => !matchedJobs.includes(job)
          );
          return [
            ...matchedJobs,
            ...remainingJobs.slice(0, 3 - matchedJobs.length),
          ];
        }

        return matchedJobs.slice(0, 3);
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        return jobs.slice(0, 3);
      }
    } catch (error) {
      console.error("Error matching jobs:", error);
      return jobs.slice(0, 3);
    }
  }
}

const jobService = JobService.getInstance();

export default jobService;
