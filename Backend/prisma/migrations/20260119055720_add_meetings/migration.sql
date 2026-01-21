-- CreateEnum
CREATE TYPE "RecordingType" AS ENUM ('CAMERA', 'SCREEN', 'AUDIO');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('INSTANT', 'SCHEDULED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "title" TEXT,
    "hostId" TEXT NOT NULL,
    "type" "MeetingType" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "micOn" BOOLEAN NOT NULL DEFAULT true,
    "camOn" BOOLEAN NOT NULL DEFAULT true,
    "autoRecord" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "RecordingType" NOT NULL,
    "fileKey" TEXT,
    "durationSec" INTEGER,
    "mimeType" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_roomId_key" ON "Meeting"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_id_key" ON "Participant"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_meetingId_userId_key" ON "Participant"("meetingId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Recording_id_key" ON "Recording"("id");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
