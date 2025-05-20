import { Router } from "express";
import jobController from "../controllers/JobController";

const jobRouter = Router();

jobRouter.get("/", jobController.getJobs);

jobRouter.get("/matches/:userId", jobController.findUserMatches);
jobRouter.get("/user/:userId", jobController.getJobsByUser);

jobRouter.get("/:id", jobController.getJobById);
jobRouter.post("/", jobController.createJob);
jobRouter.put("/:id", jobController.updateJob);
jobRouter.delete("/:id", jobController.deleteJob);

export default jobRouter;
