/*
  Warnings:

  - You are about to drop the `Caltalog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Caltalog";

-- CreateTable
CREATE TABLE "Catalog" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "Catalog_pkey" PRIMARY KEY ("id")
);
