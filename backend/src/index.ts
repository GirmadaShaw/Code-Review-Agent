import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { reviewRouter } from "./routes/review";
import { issueRouter } from "./routes/issues.js";
import { prRouter }  from "./routes/pr.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: "https://code-review-agent-dusky.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json({ limit: "30mb" }));

app.use("/review", reviewRouter);
app.use("/issues", issueRouter);
app.use("/pr", prRouter);
app.get("/", (req, res) => {
  res.send("The backend is live");
});


const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`ℹ️\tBackend running on port ${PORT}`));