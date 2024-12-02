/*
  Warnings:

  - Added the required column `detailsFirstId` to the `ProductsPageImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailsSecoundId` to the `ProductsPageImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faviritFirstId` to the `ProductsPageImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faviritSecoundId` to the `ProductsPageImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductsPageImages" ADD COLUMN     "detailsFirstId" TEXT NOT NULL,
ADD COLUMN     "detailsSecoundId" TEXT NOT NULL,
ADD COLUMN     "faviritFirstId" TEXT NOT NULL,
ADD COLUMN     "faviritSecoundId" TEXT NOT NULL;
