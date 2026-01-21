import prisma from "../lib/prisma.js";

export const startRecording = async(req, res) => {
    try {
        const { roomId, clerkId, type } = req.body;

        const user = await prisma.user.findUnique({
            where: { clerkId }
        });

        const meeting = await prisma.meeting.findUnique({
            where: { roomId }
        });

        if (!user || !meeting) {
            return res.status(400).json({ error: "Invalid meeting or user" });
        }

        const recording = await prisma.recording.create({
            data: {
                meetingId: meeting.id, 
                userId: user.id,        
                type,
                startedAt: new Date(),
                
            }
        });

        res.json(recording);
    } catch (err) {
        console.error("Start recording error:", err);
        res.status(500).json({ error: "Failed to start recording" });
    }
};

export const stopRecording = async(req, res) => {
    try {
        const { recordingId, durationSec, fileKey } = req.body;

        const recording = await prisma.recording.update({
            where: { id: recordingId },
            data: {
                durationSec,
                fileKey,
                endedAt: new Date()
            }
        });

        res.json(recording);
    } catch (err) {
        console.error("Stop recording error:", err);
        res.status(500).json({ error: "Failed to stop recording" });
    }
};

export const getMyRecordings = async (req, res) => {
  try {
    const { clerkId } = req.query;

    if (!clerkId) return res.status(400).json({ error: "Missing clerkId" });

    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) return res.json([]);

    const recordings = await prisma.recording.findMany({
      where: { userId: user.id },
      include: {
        meeting: {
            select: { title: true, roomId: true }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    res.json(recordings);
  } catch (err) {
    console.error("Get recordings error:", err);
    res.status(500).json({ error: "Failed to fetch recordings" });
  }
};

export const deleteRecording = async (req, res) => {
  try {
    const { recordingId } = req.params;
    
    await prisma.recording.delete({
      where: { id: recordingId }
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error("Delete recording error:", err);
    res.status(500).json({ error: "Failed to delete recording" });
  }
};