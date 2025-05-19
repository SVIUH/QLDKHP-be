import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateClassDto, UpdateClassDto } from "../dto/class.dto";
import { UpdateGradeDto } from "../dto/grade.dto";
import { CreateScheduleDto } from "../dto/schedule.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAdminByEmail(email: string) {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  // async getAllClasses() {
  //   return this.prisma.class.findMany();
  // }
  async getAllClasses(filter?: {
    year?: number;
    term?: number;
    subject_id?: number;
  }) {
    return this.prisma.class.findMany({
      where: {
        ...(filter?.year !== undefined && { year: filter.year }),
        ...(filter?.term !== undefined && { term: filter.term }),
        ...(filter?.subject_id !== undefined && {
          subject_id: filter.subject_id,
        }),
      },
      include: {
        subject: true, // nếu bạn muốn include luôn subject
      },
    });
  }

  async createClass(data: CreateClassDto) {
    const createClassData: Prisma.ClassCreateInput = {
      subject: { connect: { subject_id: data.subject_id } }, // do ClassCreateInput dùng relation
      professor_name: data.professor_name,
      class_name: data.class_name,
      max_capacity: data.max_capacity,
      current_capacity: data.current_capacity ?? 0,
      term: data.term,
      year: data.year,
      status: data.status ?? true,
      isEnrolling: data.isEnrolling ?? true,
      details: {
        create: data.classDetails.map((detail) => ({
          study_time: detail.study_time,
          group_practice: detail.group_practice,
          room_name: detail.room_name,
          towner: detail.towner,
        })),
      },
    };

    return this.prisma.class.create({
      data: createClassData,
      include: {
        details: true,
      },
    });
  }

  async updateClass(class_id: number, data: UpdateClassDto) {
    return this.prisma.class.update({ where: { class_id }, data });
  }

  async deleteClass(class_id: number) {
    return this.prisma.class.delete({ where: { class_id } });
  }

  async updateGrade(data: UpdateGradeDto) {
    return this.prisma.grade.updateMany({
      where: { student_id: data.student_id, subject_id: data.subject_id },
      data,
    });
  }

  async createSchedule(data: CreateScheduleDto) {
    return this.prisma.schedule.create({ data });
  }

  async updateSchedule(schedule_id: number, data: { time: Date }) {
    return this.prisma.schedule.update({
      where: { schedule_id },
      data,
    });
  }

  async deleteSchedule(schedule_id: number) {
    return this.prisma.schedule.delete({ where: { schedule_id } });
  }

  async getAllSchedules() {
    return this.prisma.schedule.findMany();
  }

  async getGradesByStudent(student_id: number) {
    return this.prisma.grade.findMany({
      where: {
        student_id: Number(student_id), // ✅ Đảm bảo student_id là số
      },
    });
  }

  async getSchedulesByStudent(student_id: number) {
    return this.prisma.schedule.findMany({
      where: {
        student_id: Number(student_id), // ✅ Đảm bảo student_id là số
      },
    });
  }

  async getAllStudents() {
    return this.prisma.student.findMany();
  }
  async updateStudent(
    student_id: number,
    data: Partial<
      Pick<
        Prisma.StudentUpdateInput,
        "student_name" | "email" | "status" | "gender"
      >
    >
  ) {
    return this.prisma.student.update({
      where: { student_id },
      data,
    });
  }

  async deleteStudent(student_id: number) {
    return this.prisma.student.delete({
      where: { student_id },
    });
  }
}
