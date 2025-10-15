import { Request, Response } from "express";
import { reviewCode } from "../services/aiService.js";

export async function reviewController(req: Request, res: Response) {
  console.log("ℹ️\tGot the request for code review");
  const { code } = req.body;
  if (!code) 
    return res.status(400).json({ error: "Code is required" });
  try {
    console.log("ℹ️\tCalling AI service")
    const analysis = await reviewCode(code);
    let parsedAnalysis;
    if (typeof analysis === "string") {
      try {
        parsedAnalysis = JSON.parse(analysis);
      } catch {
        parsedAnalysis = { summary: "Invalid JSON", findings: [] };
      }
    } else {
      parsedAnalysis = analysis;
    }
    res.json({ 
      status: "success",
      message: "Code reviewed successfully",
      analysis: parsedAnalysis
    });
    console.log("✅\tGot the response from AI service")
    return;
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to analyze code", 
      details: err 
    });
    return ;
  }
}
