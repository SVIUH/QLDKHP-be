/*
  Warnings:

  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClassDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prerequisite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "ClassDetail" DROP CONSTRAINT "ClassDetail_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "Prerequisite" DROP CONSTRAINT "Prerequisite_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_student_id_fkey";

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "ClassDetail";

-- DropTable
DROP TABLE "Education";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "Grade";

-- DropTable
DROP TABLE "Prerequisite";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Subject";

-- CreateTable
CREATE TABLE "subject" (
    "subject_id" SERIAL NOT NULL,
    "subject_name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL,
    "term" TEXT NOT NULL,
    "theory" INTEGER NOT NULL,
    "practice" INTEGER NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "prerequisite" (
    "prerequisite_id" SERIAL NOT NULL,
    "prerequisite_subject_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,

    CONSTRAINT "prerequisite_pkey" PRIMARY KEY ("prerequisite_id")
);

-- CreateTable
CREATE TABLE "student" (
    "student_id" SERIAL NOT NULL,
    "student_name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" BOOLEAN NOT NULL DEFAULT true,
    "total_credits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "education" (
    "education_id" SERIAL NOT NULL,
    "course" TEXT NOT NULL,
    "training_level" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "training_type" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "identifier_class" TEXT NOT NULL,
    "student_id" INTEGER,

    CONSTRAINT "education_pkey" PRIMARY KEY ("education_id")
);

-- CreateTable
CREATE TABLE "class" (
    "class_id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "professor_name" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "current_capacity" INTEGER NOT NULL DEFAULT 0,
    "term" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" BOOLEAN DEFAULT true,
    "isEnrolling" BOOLEAN DEFAULT true,

    CONSTRAINT "class_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "classDetail" (
    "class_detail_id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "study_time" TEXT NOT NULL,
    "group_practice" INTEGER,
    "room_name" TEXT NOT NULL,
    "towner" TEXT NOT NULL,

    CONSTRAINT "classDetail_pkey" PRIMARY KEY ("class_detail_id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "enrollment_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "class_detail_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmation_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "grade" (
    "grade_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "midterm" DOUBLE PRECISION NOT NULL,
    "final" DOUBLE PRECISION NOT NULL,
    "theory_1" DOUBLE PRECISION,
    "theory_2" DOUBLE PRECISION,
    "theory_3" DOUBLE PRECISION,
    "theory_4" DOUBLE PRECISION,
    "theory_5" DOUBLE PRECISION,
    "practice_1" DOUBLE PRECISION,
    "practice_2" DOUBLE PRECISION,
    "practice_3" DOUBLE PRECISION,
    "practice_4" DOUBLE PRECISION,
    "practice_5" DOUBLE PRECISION,
    "digit_score" DOUBLE PRECISION NOT NULL,
    "letter_score" TEXT NOT NULL,

    CONSTRAINT "grade_pkey" PRIMARY KEY ("grade_id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "schedule_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "admin" (
    "admin_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_code_key" ON "student"("code");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- AddForeignKey
ALTER TABLE "prerequisite" ADD CONSTRAINT "prerequisite_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classDetail" ADD CONSTRAINT "classDetail_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;
