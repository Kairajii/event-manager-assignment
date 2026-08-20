import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEventParticipants,
  getEvents,
  updateEvent,
} from "../controllers/event.controller";
import { applyToEvent, cancelParticipant } from "../controllers/participant.controller";

const router = Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

router.get("/:id/participants", getEventParticipants);
router.post("/:id/apply", applyToEvent);
router.put("/:id/participants/:participantId/cancel", cancelParticipant);

export default router;
