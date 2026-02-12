-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "return_location_id" INTEGER,
ADD COLUMN     "returned_at" TIMESTAMP(3),
ADD COLUMN     "returned_by_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_return_location_id_fkey" FOREIGN KEY ("return_location_id") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_returned_by_id_fkey" FOREIGN KEY ("returned_by_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
