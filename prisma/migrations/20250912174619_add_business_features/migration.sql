-- AlterTable
ALTER TABLE "StudySpot" ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBusiness" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "StudySpot" ADD CONSTRAINT "StudySpot_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
