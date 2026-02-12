/*
  Warnings:

  - The values [available] on the enum `ReportType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportType_new" AS ENUM ('borrow', 'transfer', 'sell', 'demolish');
ALTER TABLE "Requests" ALTER COLUMN "request_type" TYPE "ReportType_new" USING ("request_type"::text::"ReportType_new");
ALTER TABLE "OfficialReports" ALTER COLUMN "report_type" TYPE "ReportType_new" USING ("report_type"::text::"ReportType_new");
ALTER TYPE "ReportType" RENAME TO "ReportType_old";
ALTER TYPE "ReportType_new" RENAME TO "ReportType";
DROP TYPE "public"."ReportType_old";
COMMIT;
