import express from "express";
import "dotenv/config";
import "./db/index";
import cors from "cors";
import userRouter from "./routes/AuthRoutes";
import { User } from "./models/User";
import cookieParser from "cookie-parser";
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
    origin: ["http://localhost:3000"],
    credentials: process.env.NODE_ENV === "production" ? true : false,
  })
);

app.use("/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World ");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
