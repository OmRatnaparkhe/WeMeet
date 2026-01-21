import prisma from "../lib/prisma.js";

export const createMeeting = async (req, res) => {
  try {
    const { roomId, title, type, scheduledAt, micOn, camOn, record , name, email} = req.body;
    const clerkId = req.headers["x-clerk-id"];

    if (!clerkId || !roomId || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (type === "SCHEDULED" && !scheduledAt) {
      return res.status(400).json({ error: "scheduledAt is required" });
    }

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { 
        clerkId, 
        name: name || "Unknown User", 
        email: email || "no-email@example.com"
      },
    });

    const meeting = await prisma.meeting.create({
      data: {
        roomId,
        title,
        hostId: user.id,
        type,
        scheduledAt:
          type === "SCHEDULED" ? new Date(scheduledAt) : new Date(),
        startedAt: type === "INSTANT" ? new Date() : null,
        micOn,
        camOn,
        autoRecord: record,
      },
    });

    res.json(meeting);
  } catch (err) {
    console.error("Create meeting error:", err);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

export const joinMeeting = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, email } = req.body;
    const clerkId = req.headers["x-clerk-id"];

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { 
        clerkId,
        name: name || "Guest User", 
        email: email || "guest@example.com"
      },
    });

    const meeting = await prisma.meeting.findUnique({
      where: { roomId },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    await prisma.participant.upsert({
      where: {
        meetingId_userId: {
          meetingId: meeting.id,
          userId: user.id,
        },
      },
      update: {
        joinedAt: new Date(),
        leftAt: null,
      },
      create: {
        meetingId: meeting.id,
        userId: user.id,
      },
    });

    res.json({ joined: true });
  } catch (err) {
    console.error("Join meeting error:", err);
    res.status(500).json({ error: "Failed to join meeting" });
  }
};

export const leaveMeeting = async (req, res) => {
  try {
    const { roomId } = req.params;
    const clerkId = req.headers["x-clerk-id"];

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    const meeting = await prisma.meeting.findUnique({ where: { roomId } });

    if (!user || !meeting) {
      return res.json({ left: true });
    }

    await prisma.participant.updateMany({
      where: {
        meetingId: meeting.id,
        userId: user.id,
        leftAt: null,
      },
      data: {
        leftAt: new Date(),
      },
    });

    res.json({ left: true });
  } catch (err) {
    console.error("Leave meeting error:", err);
    res.status(500).json({ error: "Failed to leave meeting" });
  }
};


export const upcomingMeetings = async (req, res) => {
  try {
    const clerkId = req.query.clerkId;

    if (!clerkId) {
      return res.status(400).json({ error: "clerkId required" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) return res.json([]);

    const meetings = await prisma.meeting.findMany({
      where: {
        hostId: user.id,
        endedAt: null, 
      },
      orderBy: {
        scheduledAt: "asc", 
      },
    });

    res.json(meetings);
  } catch (err) {
    console.error("Upcoming meetings error:", err);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};


export const deleteMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const clerkId = req.headers["x-clerk-id"];

    const meeting = await prisma.meeting.findUnique({
       where: { id: meetingId },
       include: { host: true }
    });

    if (!meeting || meeting.host.clerkId !== clerkId) {
       return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.$transaction([
        prisma.recording.deleteMany({ where: { meetingId } }),
        
        prisma.participant.deleteMany({ where: { meetingId } }),
        
        prisma.meeting.delete({ where: { id: meetingId } })
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
};


export const endMeeting = async (req, res) => {
    try {
      const { meetingId } = req.params;
  
      await prisma.meeting.update({
        where: { id: meetingId },
        data: { endedAt: new Date() } 
      });
  
      res.json({ success: true });
    } catch (err) {
      console.error("End meeting error:", err);
      res.status(500).json({ error: "Failed to end meeting" });
    }
  };