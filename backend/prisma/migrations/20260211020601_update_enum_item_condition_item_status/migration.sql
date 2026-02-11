/*
  Warnings:

  - Changed the type of `condition` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('good', 'damaged', 'broken');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('borrowed', 'transferred', 'sold', 'demolished');

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "condition",
ADD COLUMN     "condition" "ItemCondition" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ItemStatus" NOT NULL;
