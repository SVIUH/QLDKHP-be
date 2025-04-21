-- CreateTable
CREATE TABLE "Subject" (
    "subject_id" INTEGER NOT NULL,
    "subject_name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL,
    "term" TEXT NOT NULL,
    "theory" INTEGER NOT NULL,
    "practice" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "Prerequisite" (
    "prerequisite_id" INTEGER NOT NULL,
    "prerequisite_subject_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,

    CONSTRAINT "Prerequisite_pkey" PRIMARY KEY ("prerequisite_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "student_id" INTEGER NOT NULL,
    "student_name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" BOOLEAN NOT NULL DEFAULT true,
    "total_credits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Education" (
    "education_id" INTEGER NOT NULL,
    "course" TEXT NOT NULL,
    "training_level" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "training_type" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "identifier_class" TEXT NOT NULL,
    "student_id" INTEGER,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("education_id")
);

-- CreateTable
CREATE TABLE "Class" (
    "class_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "professor_name" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "current_capacity" INTEGER NOT NULL DEFAULT 0,
    "term" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" BOOLEAN DEFAULT true,
    "isEnrolling" BOOLEAN DEFAULT true,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "ClassDetail" (
    "class_detail_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "study_time" TEXT NOT NULL,
    "group_practice" INTEGER,
    "room_name" TEXT NOT NULL,
    "towner" TEXT NOT NULL,

    CONSTRAINT "ClassDetail_pkey" PRIMARY KEY ("class_detail_id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "enrollment_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "class_detail_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmation_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "grade_id" INTEGER NOT NULL,
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

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("grade_id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "schedule_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_code_key" ON "Student"("code");

-- AddForeignKey
ALTER TABLE "Prerequisite" ADD CONSTRAINT "Prerequisite_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassDetail" ADD CONSTRAINT "ClassDetail_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;
