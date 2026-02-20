/*
  Warnings:

  - Made the column `type` on table `Notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
-- ALTER TABLE "Notifications" ALTER COLUMN "type" SET NOT NULL;
UPDATE "Notifications" SET "type" = 'system' WHERE "type" IS NULL;

ALTER TABLE "Notifications" 
ALTER COLUMN "type" SET NOT NULL;