-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "destination_location_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_destination_location_id_fkey" FOREIGN KEY ("destination_location_id") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
