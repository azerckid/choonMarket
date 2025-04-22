-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELECTRONICS', 'CLOTHING', 'BOOKS', 'HOME', 'OTHER');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'OTHER';
