import { Request, Response } from "express";
import { EventModel } from "../models/event.model";
import { ParticipantModel } from "../models/participant.model";
import { catchAsync, CustomError } from "../utils";
import { applyToEventSchema, cancelParticipantSchema } from "../validators/event.validator";

const parseId = (raw: string, label = "id"): number => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new CustomError(`Invalid ${label}`, 400);
  }
  return id;
};

export const applyToEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = parseId(req.params.id, "event id");
  const { name, email } = applyToEventSchema.parse(req.body);

  const event = await EventModel.findById(eventId);
  if (!event) throw new CustomError("Event not found", 404);

  const participant = await ParticipantModel.create(eventId, name, email);
  res.status(201).json({ success: true, data: participant });
});

export const cancelParticipant = catchAsync(async (req: Request, res: Response) => {
  const eventId = parseId(req.params.id, "event id");
  const participantId = parseId(req.params.participantId, "participant id");
  const { reason } = cancelParticipantSchema.parse(req.body);

  const participant = await ParticipantModel.findById(participantId);
  if (!participant || participant.event_id !== eventId) {
    throw new CustomError("Participant not found for this event", 404);
  }
  if (participant.status === "cancelled") {
    throw new CustomError("This registration is already cancelled", 409);
  }

  const updated = await ParticipantModel.cancel(participantId, reason);
  res.json({ success: true, data: updated });
});
