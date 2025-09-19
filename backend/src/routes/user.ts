import { Router } from "express";
import { userInfoController } from "../controllers/userInfoController";

export const userRouter = Router();


userRouter.post("/", userInfoController);
