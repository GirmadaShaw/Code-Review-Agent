import { Router } from "express";
import { getIssues } from "../controllers/getIssuesController.js";

export const issueRouter = Router();
issueRouter.get("/", getIssues);
