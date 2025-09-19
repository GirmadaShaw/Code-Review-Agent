import { Request, Response } from "express";
import { google } from "googleapis";
import dotenv from 'dotenv';
dotenv.config();  

const USER_KEYS = [
  "login",
  "id",
  "node_id",
  "avatar_url",
  "gravatar_id",
  "url",
  "html_url",
  "followers_url",
  "following_url",
  "gists_url",
  "starred_url",
  "subscriptions_url",
  "organizations_url",
  "repos_url",
  "events_url",
  "received_events_url",
  "type",
  "user_view_type",
  "site_admin",
  "name",
  "company",
  "blog",
  "location",
  "email",
  "hireable",
  "bio",
  "twitter_username",
  "notification_email",
  "public_repos",
  "public_gists",
  "followers",
  "following",
  "created_at",
  "updated_at",
];


// Auth setup
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service-account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Controller to save GitHub user info
export const userInfoController = async (req: Request, res: Response) => {
  console.log("ℹ️ User Info Controller Invoked");

  try {
    const userData = req.body;
    console.log("ℹ️ Received user data:", userData);

    // Ensure consistent row order by mapping each key
    const row = USER_KEYS.map((key) => {
      const value = userData[key];
      // If null, undefined, or empty → store ""
      return value !== null && value !== undefined ? String(value) : "";
    });

    // Append row to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:AH", // 34 columns (adjust if needed)
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    console.log("✅ User info written to Google Sheet!");
    res.status(200).json({ message: "User info saved successfully" });
  } catch (error) {
    console.error("❌ Error writing user info:", error);
    res.status(500).json({ error: "Failed to save user info" });
  }
};

