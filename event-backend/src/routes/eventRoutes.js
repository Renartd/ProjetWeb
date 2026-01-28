const express = require("express");
const eventController = require("../controllers/eventController");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  validateCreateEvent,
  validateUpdateEvent
} = require("../validators/eventValidator");

const router = express.Router();

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
