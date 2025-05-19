import { Router } from "express";
import authController from "../controllers/AuthContoller";

const userRouter = Router();

userRouter.post("/signup", authController.signup);

userRouter.post("/login", authController.login);

userRouter.post("/logout", authController.logout);

userRouter.post("/refresh", authController.refreshToken);

export default userRouter;
