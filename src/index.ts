import express from "express";
import "dotenv/config";
import "./db/index";
import cors from "cors";
import { User } from "./models/User";
import cookieParser from "cookie-parser";
import authRouter from "./routes/AuthRoutes";
import jobRouter from "./routes/JobRoutes";
import userRouter from "./routes/UserRoutes";
import authMiddleware from "./middleware";
const app = express();

app.use(express.json());
app.use(cookieParser());

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://inreal-assignment-frontend.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", authRouter);
app.use("/jobs", authMiddleware, jobRouter);
app.use("/users", authMiddleware, userRouter);

app.get("/", (req, res) => {
  res.send("Hello World ");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
