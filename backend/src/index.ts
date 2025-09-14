import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { reviewRouter } from "./routes/review.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/review", reviewRouter);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`ℹ️\tBackend running on port ${PORT}`));
