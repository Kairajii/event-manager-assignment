import { Request, Response } from "express";
import { EventModel } from "../models/event.model";
import { ParticipantModel } from "../models/participant.model";
import { catchAsync, CustomError } from "../utils";
import { createEventSchema, updateEventSchema } from "../validators/event.validator";

const parseId = (raw: string): number => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new CustomError("Invalid event id", 400);
  }
  return id;
};

export const createEvent = catchAsync(async (req: Request, res: Response) => {
  const input = createEventSchema.parse(req.body);
  const event = await EventModel.create(input);
  res.status(201).json({ success: true, data: event });
});

export const getEvents = catchAsync(async (req: Request, res: Response) => {
  const { search, location, sort } = req.query;
  const events = await EventModel.findAll({
    search: typeof search === "string" ? search : undefined,
    location: typeof location === "string" ? location : undefined,
    sort: sort === "desc" ? "desc" : "asc",
  });
  res.json({ success: true, data: events });
});

export const getEventById = catchAsync(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const event = await EventModel.findById(id);
  if (!event) throw new CustomError("Event not found", 404);
  res.json({ success: true, data: event });
});

export const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const input = updateEventSchema.parse(req.body);
  const existing = await EventModel.findById(id);
  if (!existing) throw new CustomError("Event not found", 404);
  const event = await EventModel.update(id, input);
  res.json({ success: true, data: event });
});

export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const deleted = await EventModel.remove(id);
  if (!deleted) throw new CustomError("Event not found", 404);
  res.json({ success: true, message: "Event deleted successfully" });
});

export const getEventParticipants = catchAsync(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const event = await EventModel.findById(id);
  if (!event) throw new CustomError("Event not found", 404);
  const participants = await ParticipantModel.findByEvent(id);
  res.json({ success: true, data: participants });
});
