const express = require("express");
const eventController = require("../controllers/eventController");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  validateCreateEvent,
  validateUpdateEvent,
} = require("../validators/eventValidator");

const eventManager = require("../managers/eventManager");

const router = express.Router();

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
