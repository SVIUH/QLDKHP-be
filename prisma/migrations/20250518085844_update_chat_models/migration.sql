/*
  Warnings:

  - You are about to drop the column `is_read` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_id` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `message` table. All the data in the column will be lost.
  - Changed the type of `sender_type` on the `message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('STUDENT', 'ADMIN');

-- AlterTable
ALTER TABLE "message" DROP COLUMN "is_read",
DROP COLUMN "receiver_id",
DROP COLUMN "sender_id",
DROP COLUMN "sender_type",
ADD COLUMN     "sender_type" "SenderType" NOT NULL;
