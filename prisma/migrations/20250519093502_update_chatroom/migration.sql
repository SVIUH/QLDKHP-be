/*
  Warnings:

  - You are about to drop the column `student_id` on the `chat_room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_code,admin_id]` on the table `chat_room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `student_code` to the `chat_room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat_room" DROP CONSTRAINT "chat_room_student_id_fkey";

-- DropIndex
DROP INDEX "chat_room_student_id_admin_id_key";

-- AlterTable
ALTER TABLE "chat_room" DROP COLUMN "student_id",
ADD COLUMN     "student_code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chat_room_student_code_admin_id_key" ON "chat_room"("student_code", "admin_id");

-- AddForeignKey
ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_student_code_fkey" FOREIGN KEY ("student_code") REFERENCES "student"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
