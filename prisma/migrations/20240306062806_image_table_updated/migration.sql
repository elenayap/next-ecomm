/*
  Warnings:

  - Added the required column `image_price` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "image_price",
ADD COLUMN     "image_price" INTEGER NOT NULL;
