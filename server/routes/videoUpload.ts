import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// POST /api/videos/upload (동영상 업로드)
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "파일 없음" });
  res.json({
    message: "업로드 성공!",
    fileName: req.file.filename,
    filePath: req.file.path,
    id: req.file.filename,
  });
});

// GET /api/videos/:id/vtt (동영상 id와 동일한 vtt 파일 다운로드)
router.get("/:id/vtt", (req, res) => {
  // id에서 확장자를 .vtt로 바꿔서 찾음 (동영상id가 172300000.mp4면 172300000.vtt)
  const id = req.params.id.replace(/\.[^/.]+$/, ""); // 확장자 제거
  const vttPath = path.join(uploadDir, `${id}.vtt`);
  if (!fs.existsSync(vttPath)) return res.status(404).send("VTT 파일 없음");
  res.download(vttPath, `${id}.vtt`);
});

export default router;
