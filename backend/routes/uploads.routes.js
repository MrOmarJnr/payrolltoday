/* Generic file upload (receipts / attachments). Returns a public URL that the
   frontend stores in the record's *_url column. Files are served statically
   from /uploads by server.js. */
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();
const dir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const safe = `att_${Date.now()}_${Math.floor(Math.random() * 1e6)}${ext}`;
    cb(null, safe);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

router.post("/", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });
  res.json({ success: true, url: `/uploads/${req.file.filename}`, name: req.file.originalname });
});

module.exports = router;
