/*
  Warnings:

  - Added the required column `type` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "Notifications" DROP COLUMN "type",
-- ADD COLUMN     "type" "NotificationType" NOT NULL;
-- CREATE TYPE "NotificationType" AS ENUM ('request', 'report', 'password', 'system');

ALTER TABLE "Notifications" 
ALTER COLUMN "type" TYPE "NotificationType" 
USING "type"::"NotificationType";