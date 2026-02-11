const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { requireAuth } = require("../middleware/authMiddleware");
const userService = require("../services/userService");

const router = express.Router();

/* dossier avatars */
const avatarsDir = path.join(__dirname, "..", "..", "uploads", "avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

/* multer */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, avatarsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${base}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Seules les images sont autorisées."));
    }
    cb(null, true);
  }
});

/* routes */

// récupérer son profil
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// modifier username / password
router.put("/me", requireAuth, async (req, res) => {
  try {
    const updated = await userService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// upload avatar
router.post(
  "/me/avatar",
  requireAuth,
  (req, res, next) => {
    upload.single("avatar")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "Image trop lourde (max 2 Mo)." });
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Aucune image fournie." });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    try {
      const updated = await userService.updateAvatar(req.user.id, avatarUrl);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

module.exports = router;
