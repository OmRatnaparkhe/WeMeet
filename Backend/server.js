import "dotenv/config"; 
import express from "express";
import http from "http"; 
import morgan from "morgan";
import cors from "cors";
import meetingRoutes from "./routes/meetings.js";
import recordingRoutes from "./routes/recordings.js";
import wss from "./wss.js"; 

const app = express();
const frontend_url_dev = process.env.FRONTEND_URL_DEV || "http://localhost:5173";
const frontend_url_prod = process.env.FRONTEND_URL_PROD || "https://we-meet-eight.vercel.app";

app.use(cors({
  origin: [frontend_url_prod, frontend_url_dev], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-clerk-id"],
}));

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/meetings", meetingRoutes);
app.use("/api/recordings", recordingRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const server = http.createServer(app);

wss.init(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server (API + WebSockets) running on PORT : ${PORT}`);
});