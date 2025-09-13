import { Request, Response } from "express";
import { reviewCode } from "../services/aiService.js";

export async function reviewController(req: Request, res: Response) {
  const { code } = req.body;
  if (!code) 
    return res.status(400).json({ error: "Code is required" });
  try {
    const analysis = await reviewCode(code);
    res.json({ 
      status: "success",
      message: "Code reviewed successfully",
      "analysis": analysis
    });
    console.log("✅ Got the response from AI service")
    return;
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to analyze code", 
      details: err 
    });
    return ;
  }
}
