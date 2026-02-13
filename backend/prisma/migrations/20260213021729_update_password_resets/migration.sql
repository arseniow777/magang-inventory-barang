/*
  Warnings:

  - Added the required column `new_password_hash` to the `PasswordResets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordResets" ADD COLUMN     "admin_id" INTEGER,
ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "new_password_hash" TEXT NOT NULL,
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "PasswordResets" ADD CONSTRAINT "PasswordResets_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
