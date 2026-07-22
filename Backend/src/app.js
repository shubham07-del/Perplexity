import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan"
import chatRouter from "./routes/chat.routes.js";
import cors from "cors"

const app = express()
app.set("trust proxy", 1);

app.use(cors({
  origin: [
    "https://signature-ai.online",
    "https://www.signature-ai.online",
    "https://perplexity-liard.vercel.app"
  ],
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)
export default app