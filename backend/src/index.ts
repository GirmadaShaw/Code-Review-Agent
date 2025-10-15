import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { reviewRouter } from "./routes/review";
import { issueRouter } from "./routes/issues.js";
import { prRouter }  from "./routes/pr.js";
import { userRouter } from "./routes/user";

dotenv.config();
const app = express();
app.use(cors({
  origin: ["https://code-review-agent-dusky.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json({ limit: "30mb" }));

app.use("/review", reviewRouter);
app.use("/issues", issueRouter);
app.use("/pr", prRouter);
app.use("/user", userRouter);
// app.get("/", (req, res) => {
//   res.send("The backend is live");
// });
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Zoo Management Backend</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center text-center text-white font-sans">
      <div class="max-w-lg p-8 rounded-2xl shadow-2xl bg-slate-800/70 backdrop-blur-sm border border-slate-700">
        <h1 class="text-4xl font-bold mb-4 text-blue-400"> 🩻Code Review Agent🩻 </h1>
        <p class="text-lg text-gray-300 mb-6">The backend is live and running smoothly 🚀</p>
        <div class="animate-pulse text-green-400 font-semibold">
          ● Server Online
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`ℹ️\tBackend running on port ${PORT}`));