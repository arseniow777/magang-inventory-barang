/*
  Warnings:

  - The `status` column on the `PasswordResets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PasswordResetStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "PasswordResets" DROP COLUMN "status",
ADD COLUMN     "status" "PasswordResetStatus" NOT NULL DEFAULT 'pending';
