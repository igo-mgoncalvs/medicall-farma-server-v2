-- CreateTable
CREATE TABLE "ProductsGroups" (
    "id" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,

    CONSTRAINT "ProductsGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productsGroupsId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeMain" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "button_text" TEXT NOT NULL,
    "button_link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HomeMain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WelcomeMain" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_color" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "button_text" TEXT NOT NULL,
    "button_link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WelcomeMain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogMain" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "button_text" TEXT NOT NULL,
    "button_link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CatalogMain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeProductsList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "homeProductsId" TEXT,

    CONSTRAINT "HomeProductsList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeProducts" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "image" TEXT,
    "imageId" TEXT,
    "button_text" TEXT,
    "button_link" TEXT,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HomeProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Home" (
    "id" TEXT NOT NULL,
    "homeMainId" TEXT,
    "welcomeMainId" TEXT,
    "homeProductsId" TEXT,
    "catalogMainId" TEXT,

    CONSTRAINT "Home_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuppliersScreen" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "secound_title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SuppliersScreen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsBanners" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "aboutUsId" TEXT,

    CONSTRAINT "AboutUsBanners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsHistory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AboutUsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsTeam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AboutUsTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsSpaceimages" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "aboutUsSpaceId" TEXT,

    CONSTRAINT "AboutUsSpaceimages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsSpace" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "text" TEXT,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AboutUsSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsValues" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "aboutUsId" TEXT,

    CONSTRAINT "AboutUsValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsDirectors" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "aboutUsId" TEXT,

    CONSTRAINT "AboutUsDirectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUs" (
    "id" TEXT NOT NULL,
    "aboutUsHistoryId" TEXT,
    "aboutUsTeamId" TEXT,
    "aboutUsSpaceId" TEXT,

    CONSTRAINT "AboutUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacyPolicy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PrivacyPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ContactEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "ContactEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logos" (
    "id" TEXT NOT NULL,
    "logoColorId" TEXT NOT NULL,
    "logoColor" TEXT NOT NULL,
    "logoWhiteId" TEXT NOT NULL,
    "logoWhite" TEXT NOT NULL,

    CONSTRAINT "Logos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caltalog" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "Caltalog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_route_key" ON "Product"("route");

-- CreateIndex
CREATE UNIQUE INDEX "AboutUsBanners_imageId_key" ON "AboutUsBanners"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutUsTeam_imageId_key" ON "AboutUsTeam"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutUsSpaceimages_imageId_key" ON "AboutUsSpaceimages"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productsGroupsId_fkey" FOREIGN KEY ("productsGroupsId") REFERENCES "ProductsGroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeProductsList" ADD CONSTRAINT "HomeProductsList_homeProductsId_fkey" FOREIGN KEY ("homeProductsId") REFERENCES "HomeProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_homeMainId_fkey" FOREIGN KEY ("homeMainId") REFERENCES "HomeMain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_welcomeMainId_fkey" FOREIGN KEY ("welcomeMainId") REFERENCES "WelcomeMain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_homeProductsId_fkey" FOREIGN KEY ("homeProductsId") REFERENCES "HomeProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_catalogMainId_fkey" FOREIGN KEY ("catalogMainId") REFERENCES "CatalogMain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsBanners" ADD CONSTRAINT "AboutUsBanners_aboutUsId_fkey" FOREIGN KEY ("aboutUsId") REFERENCES "AboutUs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsSpaceimages" ADD CONSTRAINT "AboutUsSpaceimages_aboutUsSpaceId_fkey" FOREIGN KEY ("aboutUsSpaceId") REFERENCES "AboutUsSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsValues" ADD CONSTRAINT "AboutUsValues_aboutUsId_fkey" FOREIGN KEY ("aboutUsId") REFERENCES "AboutUs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsDirectors" ADD CONSTRAINT "AboutUsDirectors_aboutUsId_fkey" FOREIGN KEY ("aboutUsId") REFERENCES "AboutUs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUs" ADD CONSTRAINT "AboutUs_aboutUsHistoryId_fkey" FOREIGN KEY ("aboutUsHistoryId") REFERENCES "AboutUsHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUs" ADD CONSTRAINT "AboutUs_aboutUsTeamId_fkey" FOREIGN KEY ("aboutUsTeamId") REFERENCES "AboutUsTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUs" ADD CONSTRAINT "AboutUs_aboutUsSpaceId_fkey" FOREIGN KEY ("aboutUsSpaceId") REFERENCES "AboutUsSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
