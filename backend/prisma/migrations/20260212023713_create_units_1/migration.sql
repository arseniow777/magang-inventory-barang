/*
  Warnings:

  - You are about to drop the column `item_id` on the `ItemLogHistory` table. All the data in the column will be lost.
  - You are about to drop the column `available_quantity` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `items_code` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `qr_code` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `total_quantity` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `RequestItems` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `RequestItems` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[model_code]` on the table `Items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unit_id` to the `ItemLogHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_code` to the `Items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_id` to the `RequestItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ItemStatus" ADD VALUE 'available';

-- DropForeignKey
ALTER TABLE "ItemLogHistory" DROP CONSTRAINT "ItemLogHistory_item_id_fkey";

-- DropForeignKey
ALTER TABLE "RequestItems" DROP CONSTRAINT "RequestItems_item_id_fkey";

-- DropIndex
DROP INDEX "Items_items_code_key";

-- AlterTable
ALTER TABLE "ItemLogHistory" DROP COLUMN "item_id",
ADD COLUMN     "unit_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Items" DROP COLUMN "available_quantity",
DROP COLUMN "condition",
DROP COLUMN "items_code",
DROP COLUMN "qr_code",
DROP COLUMN "status",
DROP COLUMN "total_quantity",
ADD COLUMN     "model_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RequestItems" DROP COLUMN "item_id",
DROP COLUMN "quantity",
ADD COLUMN     "unit_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ItemUnits" (
    "id" SERIAL NOT NULL,
    "unit_code" TEXT NOT NULL,
    "condition" "ItemCondition" NOT NULL,
    "status" "ItemStatus" NOT NULL,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "ItemUnits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemUnits_unit_code_key" ON "ItemUnits"("unit_code");

-- CreateIndex
CREATE UNIQUE INDEX "Items_model_code_key" ON "Items"("model_code");

-- AddForeignKey
ALTER TABLE "ItemUnits" ADD CONSTRAINT "ItemUnits_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestItems" ADD CONSTRAINT "RequestItems_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ItemUnits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLogHistory" ADD CONSTRAINT "ItemLogHistory_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "ItemUnits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
