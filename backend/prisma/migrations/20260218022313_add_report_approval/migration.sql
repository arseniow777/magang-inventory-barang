/*
  Warnings:

  - You are about to drop the `Items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemPhotos" DROP CONSTRAINT "ItemPhotos_item_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemUnits" DROP CONSTRAINT "ItemUnits_item_id_fkey";

-- AlterTable
ALTER TABLE "OfficialReports" ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "approved_by_id" INTEGER,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Items";

-- CreateTable
CREATE TABLE "ItemMasters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model_code" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "procurement_year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemMasters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemMasters_model_code_key" ON "ItemMasters"("model_code");

-- AddForeignKey
ALTER TABLE "ItemUnits" ADD CONSTRAINT "ItemUnits_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "ItemMasters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPhotos" ADD CONSTRAINT "ItemPhotos_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "ItemMasters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialReports" ADD CONSTRAINT "OfficialReports_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
