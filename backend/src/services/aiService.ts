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



interface AIInput {
  prNumber: number;
  prMeta: { filename: string; patch: string }[];
  linkedIssues: { issueNumber: number; title: string; body: string }[];
}

interface AIResponse {
  summary: string;
  findings: {
    file: string;
    line: number;
    severity: "critical" | "high" | "medium" | "low";
    comment: string;
    suggestedFix?: string;
  }[];
}


export const analyzePRWithAI = async (input: AIInput): Promise<AIResponse> => {
  console.log(`ℹ️\tInvoking model: ${MODEL}`);
  const prompt = `
You are a senior software engineer who is assigned a task to review code. Your task is to analyze the following GitHub PR and provide actionable, concise feedback for each changed file. Do NOT repeat comments. Focus on code quality, security issues, maintainability, and whether the PR addresses the linked issues. Ignore the changes in the package.json or related file. But just mention whatever comment you want to give the summary only. 

Format your output strictly as JSON in this exact structure:

{
  "summary": "Brief overall summary of the PR, including strengths and major issues.",
  "findings": [
    {
      "file": "filename",
      "line": 1,
      "severity": "critical|high|medium|low",
      "comment": "Concise advice for this file and line",
      "suggestedFix": "Optional suggested fix"
    }
  ]
}

Inputs:
PR Number: ${input.prNumber}
Changed Files and Patches: ${JSON.stringify(input.prMeta)}
Linked Issues: ${JSON.stringify(input.linkedIssues)}

Provide output as JSON only. Do not include explanations outside of JSON.
`;

   const result = await model.generateContent(prompt);
   const raw = result.response.candidates?.[0]?.content.parts.map(p => p.text).join("")
                                                                        .replace(/^```json\s*|\s*```$/g, "")
                                                                        .slice(0, -4);
   let aiResponse: AIResponse;

   if (raw) {
   try {
      aiResponse = JSON.parse(raw) as AIResponse;
   } catch (err) {
      console.error("❌\tFailed to parse AI response:", err);
      aiResponse = { summary: "", findings: [] }; 
   }
   } else {
      console.log("ℹ️\tUsing fallback. Couldn't parse raw response as json")
   aiResponse = { summary: "", findings: [] };
   }
   return aiResponse;
};