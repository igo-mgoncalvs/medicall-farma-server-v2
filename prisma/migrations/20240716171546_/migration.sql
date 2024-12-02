-- AlterTable
ALTER TABLE "ProductsPageImages" ADD COLUMN     "faviritFirstMobile" TEXT,
ADD COLUMN     "faviritFirstMobileId" TEXT,
ADD COLUMN     "faviritSecoundMobile" TEXT,
ADD COLUMN     "faviritSecoundMobileId" TEXT;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);
