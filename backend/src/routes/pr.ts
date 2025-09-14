import { Router } from "express";
import { fetchOpenPRs, analyzePR } from "../controllers/prController.js";
import { postReviewComments } from "../controllers/postReviewComment.js";


export const prRouter = Router();

prRouter.post("/fetch", fetchOpenPRs);
prRouter.post("/analyze", analyzePR);
prRouter.post("/send-comments", postReviewComments);

