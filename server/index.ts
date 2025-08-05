import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import videoUploadRouter from "./routes/videoUpload";
import { handleDemo } from "./routes/demo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ dist/spa 정적 파일 서빙
const staticPath = path.join(__dirname, "..", "dist", "spa");
app.use(express.static(staticPath));

// SPA 라우팅 지원
app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// --- API 라우트
app.use("/api/videos", videoUploadRouter);
app.get("/api/demo", handleDemo);
app.get("/api/ping", (_req, res) => {
  res.json({ message: "Hello from Express server v2!" });
});

app.listen(3000, () => {
  console.log("서버 실행: http://localhost:3000");
});
