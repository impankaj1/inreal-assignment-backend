import mongoose from "mongoose";
import JobModel from "./models/Jobs";
import { JobType } from "./models/User";
import "dotenv/config";
import UserModel from "./models/User";

const jobs = [
  {
    title: "Senior Full Stack Developer",
    description:
      "Looking for an experienced full stack developer to join our team. Must have experience with React, Node.js, and MongoDB.",
    location: "San Francisco, CA",
    salary: 150000,
    company: "TechCorp Inc",
    jobType: JobType.REMOTE,
  },
  {
    title: "Frontend Developer",
    description:
      "Join our frontend team to build beautiful and responsive user interfaces using React and TypeScript.",
    location: "New York, NY",
    salary: 120000,
    company: "WebSolutions",
    jobType: JobType.HYBRID,
  },
  {
    title: "Backend Engineer",
    description:
      "Design and implement scalable backend services using Node.js and MongoDB.",
    location: "Seattle, WA",
    salary: 130000,
    company: "CloudTech",
    jobType: JobType.ONSITE,
  },
  {
    title: "DevOps Engineer",
    description:
      "Manage cloud infrastructure and implement CI/CD pipelines using AWS and Docker.",
    location: "Austin, TX",
    salary: 140000,
    company: "DevOpsPro",
    jobType: JobType.REMOTE,
  },
  {
    title: "Mobile App Developer",
    description:
      "Develop cross-platform mobile applications using React Native.",
    location: "Boston, MA",
    salary: 125000,
    company: "MobileFirst",
    jobType: JobType.HYBRID,
  },
  {
    title: "Data Scientist",
    description:
      "Work with large datasets and implement machine learning models using Python.",
    location: "Chicago, IL",
    salary: 145000,
    company: "DataInsights",
    jobType: JobType.ONSITE,
  },
  {
    title: "UI/UX Designer",
    description:
      "Create beautiful and intuitive user interfaces using Figma and Adobe Creative Suite.",
    location: "Portland, OR",
    salary: 110000,
    company: "DesignHub",
    jobType: JobType.REMOTE,
  },
  {
    title: "QA Engineer",
    description:
      "Implement automated testing and ensure software quality across our products.",
    location: "Denver, CO",
    salary: 100000,
    company: "QualityFirst",
    jobType: JobType.HYBRID,
  },
  {
    title: "Product Manager",
    description:
      "Lead product development and work closely with engineering teams to deliver features.",
    location: "Miami, FL",
    salary: 135000,
    company: "ProductLabs",
    jobType: JobType.ONSITE,
  },
  {
    title: "Security Engineer",
    description:
      "Implement security best practices and conduct security audits.",
    location: "Washington, DC",
    salary: 155000,
    company: "SecureTech",
    jobType: JobType.REMOTE,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const users = await UserModel.findOne();

    await JobModel.insertMany(
      jobs.map((job) => ({ ...job, createdBy: users?.toObject()._id }))
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
