import { Router } from "express";
import {
  deleteRecording,
  getMyRecordings,
  startRecording,
  stopRecording
} from "../controllers/recording.controller.js";

const router = Router();

router.post("/start", startRecording);
router.post("/stop", stopRecording);
router.get("/",getMyRecordings);
router.delete("/:recordingId", deleteRecording);
export default router;
