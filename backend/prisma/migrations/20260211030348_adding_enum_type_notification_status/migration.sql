/*
  Warnings:

  - The values [sent] on the enum `NotificationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationStatus_new" AS ENUM ('Succeed', 'failed', 'pending');
ALTER TABLE "public"."Notifications" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Notifications" ALTER COLUMN "status" TYPE "NotificationStatus_new" USING ("status"::text::"NotificationStatus_new");
ALTER TYPE "NotificationStatus" RENAME TO "NotificationStatus_old";
ALTER TYPE "NotificationStatus_new" RENAME TO "NotificationStatus";
DROP TYPE "public"."NotificationStatus_old";
ALTER TABLE "Notifications" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "Notifications" ALTER COLUMN "status" SET DEFAULT 'pending';
