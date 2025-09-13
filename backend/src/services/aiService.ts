import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function reviewCode(snippet: string) {
  const prompt = `
  You are a senior software engineer who is asked to review code.
  Analyze the following code for:
  - Security issues
  - Best practice violations
  - Refactoring suggestions

  Return JSON with keys: summary, findings[file,line,issue,severity,fix].
  Code:
  ${snippet}
  `;
  console.log("ℹ️ Sending for review to model: gemini-1.5-flash")
  const result = await model.generateContent(prompt);
  return result.response.candidates?.[0]?.content.parts.map(p => p.text).join("")
                                                                        .replace(/^```json\s*|\s*```$/g, "")
                                                                        .slice(0, -4);
}
