/*
  Warnings:

  - Made the column `productsGroupsId` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_productsGroupsId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "productsGroupsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_productsGroupsId_fkey" FOREIGN KEY ("productsGroupsId") REFERENCES "ProductsGroups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
