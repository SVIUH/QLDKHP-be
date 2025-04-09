/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ClassToDBDto } from './dto/class.db.dto'
import { EnrollmentEnum } from 'src/enums'
@Injectable()
export class ClassRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: ClassToDBDto) {
    return await this.prisma.class.create({
      data: {
        class_id: data.class_id,
        max_capacity: data.max_capacity,
        current_capacity: 0,
        professor_name: data.professor_name,
        class_name: data.class_name,
        term: data.term,
        isEnrolling: true,
        year: data.year,
        subject: {
          connect: {
            subject_id: data.subject_id,
          },
        },
        details: {
          create: data.class_details,
        },
      },
    })
  }

  async getAll() {
    const rs = await this.prisma.class.findMany({
      include: {
        subject: true,
        details: true,
      },
    })

    return rs
  }

  async closeRegister(subject_id: number) {
    const updated = await this.prisma.class.updateMany({
      where: {
        subject_id: subject_id,
      },
      data: {
        isEnrolling: false,
      },
    })

    if (updated.count === 0) {
      return false
    }

    const closeEnroll = await this.prisma.enrollment.updateMany({
      where: {
        class: {
          subject_id: subject_id,
        },
      },
      data: {
        confirmation_status: true,
      },
    })

    // get full student infor each class
    if (updated.count > 0 && closeEnroll.count > 0) {
      const rs = await this.prisma.class.findMany({
        where: {
          subject_id,
        },
        select: {
          enrollments: true,
        },
      })

      const email = (
        await Promise.all(
          rs.map(async (item) => {
            if (item.enrollments.length > 0) {
              const student = await this.prisma.student.findUnique({
                where: {
                  student_id: item.enrollments[0].student_id,
                },
                select: {
                  student_name: true,
                  email: true,
                },
              })
              return student
            }
          }),
        )
      ).filter((student) => student !== undefined)

      return email
    }
  }

  async checkCapacityOfClass(classId: number) {
    const rs = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
      },
      select: {
        current_capacity: true,
        max_capacity: true,
      },
    })

    if (rs.current_capacity < rs.max_capacity) {
      return true // class is not full and can be enrolled
    } else {
      return false // class is full and cannot be enrolled
    }
  }

  async getClassById(classId: number) {
    const classRegistion = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
      },
      include: {
        subject: true,
      },
    })

    return classRegistion
  }
}
