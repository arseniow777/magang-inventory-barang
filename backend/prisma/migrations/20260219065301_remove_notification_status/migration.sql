/*
  Warnings:

  - You are about to drop the column `status` on the `Notifications` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('request', 'report', 'password', 'system');

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "status";

-- DropEnum
DROP TYPE "NotificationStatus";
