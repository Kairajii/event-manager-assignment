import { Router } from "express";
import eventRoutes from "./event.routes";

const router = Router();

router.use("/events", eventRoutes);

export default router;
