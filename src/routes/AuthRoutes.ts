import { Router } from "express";
import authController from "../controllers/AuthContoller";

const authRouter = Router();

authRouter.post("/signup", authController.signup);

authRouter.post("/login", authController.login);

authRouter.post("/logout", authController.logout);

authRouter.post("/refresh", authController.refreshToken);

export default authRouter;
