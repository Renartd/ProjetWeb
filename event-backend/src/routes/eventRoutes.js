import express from "express";
import eventController from "../controllers/eventController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateCreateEvent, validateUpdateEvent } from "../validators/eventValidator.js";

const router = express.Router();

router.get("/", eventController.list);
router.get("/:id", eventController.get);

router.post("/", requireAuth, (req, res, next) => {
  const error = validateCreateEvent(req.body);
  if (error) return res.status(400).json(error);
  next();
}, eventController.create);

router.put("/:id", requireAuth, (req, res, next) => {
  const error = validateUpdateEvent(req.body);
  if (error) return res.status(400).json(error);
  next();
}, eventController.update);

router.delete("/:id", requireAuth, eventController.remove);

export default router;
