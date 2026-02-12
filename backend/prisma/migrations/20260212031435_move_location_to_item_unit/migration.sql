/*
  Warnings:

  - You are about to drop the column `location_id` on the `Items` table. All the data in the column will be lost.
  - Added the required column `location_id` to the `ItemUnits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_location_id_fkey";

-- AlterTable
ALTER TABLE "ItemUnits" ADD COLUMN     "location_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Items" DROP COLUMN "location_id";

-- AddForeignKey
ALTER TABLE "ItemUnits" ADD CONSTRAINT "ItemUnits_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
