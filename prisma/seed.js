const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Thêm dữ liệu cho bảng Subject
  const subjects = await prisma.subject.createMany({
    data: [
      { subject_name: "Mathematics", credits: 3, isRequired: true, term: "1", theory: 30, practice: 10 },
      { subject_name: "Physics", credits: 4, isRequired: true, term: "2", theory: 40, practice: 15 },
      { subject_name: "Chemistry", credits: 3, isRequired: false, term: "1", theory: 30, practice: 10 },
      { subject_name: "Biology", credits: 3, isRequired: false, term: "2", theory: 35, practice: 12 },
      { subject_name: "Computer Science", credits: 4, isRequired: true, term: "1", theory: 40, practice: 20 },
    ],
  });

  // Thêm dữ liệu cho bảng Student
  const students = await prisma.student.createMany({
    data: [
      { student_name: "Alice", code: 1001, status: "active", password: await bcrypt.hash("password1", 10), email: "alice@example.com" },
      { student_name: "Bob", code: 1002, status: "active", password: await bcrypt.hash("password2", 10), email: "bob@example.com" },
      { student_name: "Charlie", code: 1003, status: "inactive", password: await bcrypt.hash("password3", 10), email: "charlie@example.com" },
      { student_name: "David", code: 1004, status: "active", password: await bcrypt.hash("password4", 10), email: "david@example.com" },
      { student_name: "Eve", code: 1005, status: "active", password: await bcrypt.hash("password5", 10), email: "eve@example.com" },
    ],
  });

  // Thêm dữ liệu cho bảng Education (liên kết với Student)
  const educations = await prisma.education.createMany({
    data: [
      { course: "2025", training_level: "Bachelor", sector: "Science", faculty: "Mathematics", training_type: "Full-time", major: "Mathematics", facility: "Campus A", identifier_class: "MATH-2025", student_id: 1 },
      { course: "2025", training_level: "Bachelor", sector: "Engineering", faculty: "Physics", training_type: "Full-time", major: "Physics", facility: "Campus B", identifier_class: "PHYS-2025", student_id: 2 },
      { course: "2025", training_level: "Bachelor", sector: "Chemistry", faculty: "Chemistry", training_type: "Full-time", major: "Chemistry", facility: "Campus C", identifier_class: "CHEM-2025", student_id: 3 },
      { course: "2025", training_level: "Bachelor", sector: "Biology", faculty: "Biology", training_type: "Full-time", major: "Biology", facility: "Campus D", identifier_class: "BIOL-2025", student_id: 4 },
      { course: "2025", training_level: "Bachelor", sector: "Computer Science", faculty: "IT", training_type: "Full-time", major: "CS", facility: "Campus E", identifier_class: "CS-2025", student_id: 5 },
    ],
  });

  // Thêm dữ liệu cho bảng Class
  const classes = await prisma.class.createMany({
    data: [
      { subject_id: 1, professor_name: "Dr. Smith", class_name: "Math101", max_capacity: 30, term: 1, year: 2025 },
      { subject_id: 2, professor_name: "Dr. Johnson", class_name: "Physics101", max_capacity: 25, term: 2, year: 2025 },
      { subject_id: 3, professor_name: "Dr. Brown", class_name: "Chemistry101", max_capacity: 20, term: 1, year: 2025 },
      { subject_id: 4, professor_name: "Dr. White", class_name: "Biology101", max_capacity: 30, term: 2, year: 2025 },
      { subject_id: 5, professor_name: "Dr. Black", class_name: "CS101", max_capacity: 40, term: 1, year: 2025 },
    ],
  });

  // Thêm dữ liệu cho bảng Enrollment
  const enrollments = await prisma.enrollment.createMany({
    data: [
      { student_id: 1, class_id: 1, class_detail_id: 1, status: "enrolled", confirmation_status: true },
      { student_id: 2, class_id: 2, class_detail_id: 2, status: "enrolled", confirmation_status: false },
      { student_id: 3, class_id: 3, class_detail_id: 3, status: "pending", confirmation_status: false },
      { student_id: 4, class_id: 4, class_detail_id: 4, status: "enrolled", confirmation_status: true },
      { student_id: 5, class_id: 5, class_detail_id: 5, status: "enrolled", confirmation_status: true },
    ],
  });

  // Thêm dữ liệu cho bảng Grade
  const grades = await prisma.grade.createMany({
    data: [
      { student_id: 1, subject_id: 1, midterm: 7.5, final: 8.0, digit_score: 7.8, letter_score: "B+" },
      { student_id: 2, subject_id: 2, midterm: 6.5, final: 7.0, digit_score: 6.8, letter_score: "C+" },
      { student_id: 3, subject_id: 3, midterm: 5.5, final: 6.0, digit_score: 5.8, letter_score: "D+" },
      { student_id: 4, subject_id: 4, midterm: 8.5, final: 9.0, digit_score: 8.8, letter_score: "A" },
      { student_id: 5, subject_id: 5, midterm: 9.0, final: 9.5, digit_score: 9.3, letter_score: "A+" },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
