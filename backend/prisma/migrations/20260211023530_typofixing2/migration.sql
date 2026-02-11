/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OfficialReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_location_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemLogHistory" DROP CONSTRAINT "ItemLogHistory_from_location_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemLogHistory" DROP CONSTRAINT "ItemLogHistory_item_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemLogHistory" DROP CONSTRAINT "ItemLogHistory_moved_by_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemLogHistory" DROP CONSTRAINT "ItemLogHistory_request_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemLogHistory" DROP CONSTRAINT "ItemLogHistory_to_location_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemPhoto" DROP CONSTRAINT "ItemPhoto_item_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "OfficialReport" DROP CONSTRAINT "OfficialReport_issued_by_id_fkey";

-- DropForeignKey
ALTER TABLE "OfficialReport" DROP CONSTRAINT "OfficialReport_request_id_fkey";

-- DropForeignKey
ALTER TABLE "PasswordReset" DROP CONSTRAINT "PasswordReset_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_pic_id_fkey";

-- DropForeignKey
ALTER TABLE "RequestItem" DROP CONSTRAINT "RequestItem_item_id_fkey";

-- DropForeignKey
ALTER TABLE "RequestItem" DROP CONSTRAINT "RequestItem_request_id_fkey";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "ItemPhoto";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "OfficialReport";

-- DropTable
DROP TABLE "PasswordReset";

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "RequestItem";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'pic',
    "phone_number" TEXT,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "telegram_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "items_code" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "available_quantity" INTEGER NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "procurement_year" INTEGER NOT NULL,
    "condition" "ItemCondition" NOT NULL,
    "status" "ItemStatus" NOT NULL,
    "qr_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location_id" INTEGER NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" SERIAL NOT NULL,
    "location_code" TEXT NOT NULL,
    "building_name" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "request_code" TEXT NOT NULL,
    "request_type" "ReportType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pic_id" INTEGER NOT NULL,
    "admin_id" INTEGER,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestItems" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "request_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "RequestItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPhotos" (
    "id" SERIAL NOT NULL,
    "file_path" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "ItemPhotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialReports" (
    "id" SERIAL NOT NULL,
    "report_number" TEXT NOT NULL,
    "report_type" "ReportType" NOT NULL,
    "issued_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" INTEGER NOT NULL,
    "issued_by_id" INTEGER NOT NULL,

    CONSTRAINT "OfficialReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'sent',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResets" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "PasswordResets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_employee_id_key" ON "Users"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Items_items_code_key" ON "Items"("items_code");

-- CreateIndex
CREATE UNIQUE INDEX "Locations_location_code_key" ON "Locations"("location_code");

-- CreateIndex
CREATE UNIQUE INDEX "Requests_request_code_key" ON "Requests"("request_code");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialReports_report_number_key" ON "OfficialReports"("report_number");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialReports_request_id_key" ON "OfficialReports"("request_id");

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_pic_id_fkey" FOREIGN KEY ("pic_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestItems" ADD CONSTRAINT "RequestItems_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestItems" ADD CONSTRAINT "RequestItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPhotos" ADD CONSTRAINT "ItemPhotos_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialReports" ADD CONSTRAINT "OfficialReports_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialReports" ADD CONSTRAINT "OfficialReports_issued_by_id_fkey" FOREIGN KEY ("issued_by_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLogHistory" ADD CONSTRAINT "ItemLogHistory_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLogHistory" ADD CONSTRAINT "ItemLogHistory_from_location_id_fkey" FOREIGN KEY ("from_location_id") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLogHistory" ADD CONSTRAINT "ItemLogHistory_to_location_id_fkey" FOREIGN KEY ("to_location_id") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLogHistory" ADD CONSTRAINT "ItemLogHistory_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLogHistory" ADD CONSTRAINT "ItemLogHistory_moved_by_id_fkey" FOREIGN KEY ("moved_by_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResets" ADD CONSTRAINT "PasswordResets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
