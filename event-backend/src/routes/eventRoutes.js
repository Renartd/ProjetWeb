const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const eventController = require("../controllers/eventController");
const eventService = require("../services/eventService");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  validateCreateEvent,
  validateUpdateEvent,
} = require("../validators/eventValidator");

const eventManager = require("../managers/eventManager");

const router = express.Router();

/* ---------------------- CONFIG UPLOAD IMAGE ---------------------- */

const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const unique = Date.now();
    cb(null, `${base}_${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mo max
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Seules les images sont autorisées."));
    }
    cb(null, true);
  }
});

/* ---------------------- ROUTE PAGINATION ---------------------- */
router.get("/paginated", async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const events = await eventManager.getPaginatedEvents(limit, offset);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ---------------------- ROUTE PARTICIPANTS ---------------------- */
router.get("/:id/participants", async (req, res) => {
  const eventId = req.params.id;
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const data = await eventManager.getParticipantsPaginated(eventId, limit, offset);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ---------------------- ROUTE UPLOAD IMAGE ---------------------- */

router.post(
  "/:id/image",
  requireAuth,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "Image trop lourde (max 2 Mo)." });
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "Aucune image fournie." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    try {
      const updated = await eventService.updateEventImage(
        eventId,
        imageUrl,
        userId
      );
      if (!updated) {
        return res.status(404).json({ error: "Événement introuvable." });
      }
      res.json(updated);
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || "Erreur serveur" });
    }
  }
);

/* ---------------------- ROUTES STANDARD ---------------------- */

router.get("/", eventController.list);
router.get("/:id", eventController.get);

router.post(
  "/",
  requireAuth,
  (req, res, next) => {
    const error = validateCreateEvent(req.body);
    if (error) return res.status(400).json(error);
    next();
  },
  eventController.create
);

router.put(
  "/:id",
  requireAuth,
  (req, res, next) => {
    const error = validateUpdateEvent(req.body);
    if (error) return res.status(400).json(error);
    next();
  },
  eventController.update
);

router.delete("/:id", requireAuth, eventController.remove);

module.exports = router;
