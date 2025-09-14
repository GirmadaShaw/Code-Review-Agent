import { postInlineComment } from "../services/githubService.js";
import { Request, Response } from "express";

export const postReviewComments = async (req: Request, res: Response) => {
  try {
    const { token, owner, repo, prNumber, headSha, aiResponse } = req.body;

    if (!token || !owner || !repo || !prNumber || !headSha || !aiResponse) {
      return res.status(400).json({ message: "token, owner, repo, prNumber, headSha, aiResponse required" });
    }

    for (const finding of aiResponse.findings) {
      await postInlineComment(
        token,
        owner,
        repo,
        prNumber,
        headSha,
        finding.file,
        finding.line,
        `${finding.comment}${finding.suggestedFix ? `\nSuggested fix: ${finding.suggestedFix}` : ""}`
      );
    }

    return res.json({ message: "Comments posted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error posting comments" });
  }
};
