import { Request, Response } from "express";
import { google } from "googleapis";
import dotenv from 'dotenv';
import path from "path";
dotenv.config();  

// Auth setup
const keyFilePath = path.join(process.cwd(), "service-account.json");
const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Controller to save GitHub user info
export const userInfoController = async (req: Request, res: Response) => {
    console.log("ℹ️\tUser Info Controller Invoked")
  try {
    const userData = req.body; 
    if (!userData || !userData.login) {
      return res.status(400).json({ error: "Invalid user data" });
    }
    // Map the userData to a row
    const row = [
      userData.login,
      userData.id,
      userData.node_id,
      userData.avatar_url,
      userData.html_url,
      userData.name,
      userData.company,
      userData.blog,
      userData.location,
      userData.email,
      userData.bio,
      userData.public_repos,
      userData.followers,
      userData.following,
      new Date().toISOString(),
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID, // Put your sheet ID in .env
      range: "Sheet1!A:Z",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
    console.log("✅ User info written to Google Sheet!");

    res.status(200).json({ message: "User info saved successfully" });
  } catch (error) {
    console.error("❌ Error writing user info:", error);
    res.status(500).json({ error: "Failed to save user info" });
  }
};
