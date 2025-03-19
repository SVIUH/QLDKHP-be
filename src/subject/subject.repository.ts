/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SubjectToDBDto } from './dto/subject.db.dto'
@Injectable()
export class SubjectRepository {
  constructor(private prisma: PrismaService) {}

  async createSubject(data: SubjectToDBDto) {
    return this.prisma.subject.create({
      data: {
        subject_id: data.subject.subject_id,
        subject_name: data.subject.subject_name,
        credits: data.subject.credits,
        isRequired: data.subject.isRequired,
        term: data.subject.term,
        theory: data.subject.theory,
        practice: data.subject.practice,
        prerequisites: {
          create: data.prerequisites,
        },
      },
    })
  }

  async getAllSubjects() {
    const data = await this.prisma.subject.findMany({
      include: {
        prerequisites: true,
        grades: true,
      },
    })

    return data
  }

  async getAllSubjectOpenRegister(studentId: number) {
    const data = await this.prisma.subject.findMany({
      where: {
        isRequired: false,
        grades: {
          none: {
            student_id: studentId,
          },
        },
      },
      include: {
        prerequisites: true,
        classes: true,
      },
    })
    return data
  }

  async getSubjectById(subjectId: number) {
    const subject = await this.prisma.subject.findUnique({
      where: {
        subject_id: subjectId,
      },
      select: {
        prerequisites: true,
      },
    })
    return subject
  }

  async currentCredit(class_id: number) {
    const credit = await this.prisma.class.findUnique({
      where: {
        class_id: class_id,
      },
      select: {
        subject: {
          select: {
            credits: true,
          },
        },
      },
    })
    return credit
  }
}
