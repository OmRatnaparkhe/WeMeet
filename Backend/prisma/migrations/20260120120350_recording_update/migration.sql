-- AlterTable
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Recording_id_key";
