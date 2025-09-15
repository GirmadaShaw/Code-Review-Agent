import { Request, Response } from "express";
import { getOpenPRs, getPRFiles, getLinkedIssues } from "../services/githubService.js";
import { analyzePRWithAI } from "../services/aiService.js";


interface AIInput {
  prNumber: number;
  prMeta: { filename: string; patch: string }[];
  linkedIssues: { issueNumber: number; title: string; body: string }[];
}


export const fetchOpenPRs = async (req: Request, res: Response) => {
  console.log("ℹ️\tReceived request to fetch open PRs")
  try {
    const { token, owner, repo } = req.body;

    if (!token || !owner || !repo) {
      return res.status(400).json({ message: "token, owner, and repo are required" });
    }

    const prs = await getOpenPRs(token, owner, repo);
    console.log("✅\tFetched all the Open PRs in the Repo")
    return res.json(prs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching PRs" });
  }
};

export const analyzePR = async (req: Request, res: Response) => {
  console.log("ℹ️\tReceived request to analyze the PR")
  try {
    const { token, owner, repo, prNumber } = req.body;

    if (!token || !owner || !repo || !prNumber) {
      return res.status(400).json({ message: "token, owner, repo, prNumber are required" });
    }

    const prMeta = await getPRFiles(token, owner, repo, prNumber);
    const linkedIssues = await getLinkedIssues(token, owner, repo, prNumber);

    const aiInput: AIInput = {
    prNumber,
    prMeta,
    linkedIssues: linkedIssues.map(issue => ({
        issueNumber: issue.issueNumber,
        title: issue.title,
        body: issue.body || "",
    })),
    };
    const aiResponse = await analyzePRWithAI(aiInput);
    // console.log("AI response in prController: ", aiResponse);
    console.log("✅\tGot the analysis from AI")
    return res.json(aiResponse);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error analyzing PR" });
  }
};
