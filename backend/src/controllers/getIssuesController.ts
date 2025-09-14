import { Octokit } from "@octokit/rest";
import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();

const owner = "GirmadaShaw";
const repo = "Code-Review-Agent";

const octokit = new Octokit({
  auth: process.env.GITHUB_API_KEY
});

export async function getIssues(req: Request, res: Response) {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: "all",
    });

    // console.log("Fetched Issues:", data);

    res.json({
      status: "success",
      issues: data,
    });
  } catch (error: any) {
    // console.error("Error fetching issues:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch issues",
      details: error.message,
    });
  }
}
