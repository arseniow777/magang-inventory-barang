/*
  Warnings:

  - Changed the type of `report_type` on the `OfficialReport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OfficialReport" DROP COLUMN "report_type",
ADD COLUMN     "report_type" "ReportType" NOT NULL;
