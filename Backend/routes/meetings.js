import { Router } from "express";
import { createMeeting, deleteMeeting, endMeeting, joinMeeting, leaveMeeting, upcomingMeetings} from "../controllers/meeting.controller.js"
const router =  Router();

router.post("/:roomId/join",joinMeeting);
router.post("/:roomId/leave",leaveMeeting);
router.post("/schedule",createMeeting);
router.get("/upcoming",upcomingMeetings);
router.delete("/:meetingId",deleteMeeting);
router.patch("/:meetingId/end",endMeeting);
export default router;