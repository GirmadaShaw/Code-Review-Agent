import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const model = genAI.getGenerativeModel({ model: MODEL });

export async function reviewCode(snippet: string) {
  console.log(`ℹ️\tInvoking model: ${MODEL}`);
  const prompt = `
Your task is to analyze the following code thoroughly. Do not repeat yourself in any way. 
Focus on:
1. Security Analysis:
   - Identify potential security vulnerabilities (e.g., SQL injection, hardcoded secrets, unsafe API usage, improper input validation).
   - Explain why each issue is risky and how it can be exploited.
2. Industry Best Practices:
   - Detect violations of coding standards or best practices.
   - Suggest improvements for readability, maintainability, and scalability.
3. Refactoring Recommendations:
   - Propose concrete refactoring suggestions to enhance performance, maintainability, and modularity.
   - Highlight redundant, inefficient, or overly complex parts of the code.
4. Summary Report:
   - Provide a concise summary of the code's strengths and weaknesses.
   - Include actionable remediation steps for each issue.
  Return JSON with keys: summary, findings[file,line,issue,severity,fix].
  Code:
  ${snippet}
  `;
  const result = await model.generateContent(prompt);
  return result.response.candidates?.[0]?.content.parts.map(p => p.text).join("")
                                                                        .replace(/^```json\s*|\s*```$/g, "")
                                                                        .slice(0, -4);
}
