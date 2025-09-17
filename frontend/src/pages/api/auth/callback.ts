import { NextApiRequest, NextApiResponse } from "next";
// import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) return res.status(400).send("No code provided");

  // Exchange code for access token
  const tokenResponse = await fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const data = await tokenResponse.json();
  const accessToken = data.access_token;
  if (!accessToken) return res.status(400).send("Could not get access token");
  
  res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/repos?token=${accessToken}`);
}
