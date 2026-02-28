-- AlterTable
ALTER TABLE "ItemMasters" ADD COLUMN     "pic_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ItemMasters" ADD CONSTRAINT "ItemMasters_pic_id_fkey" FOREIGN KEY ("pic_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
