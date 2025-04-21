/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { GradeToDBDto } from './dto/grade.db.dto'
@Injectable()
export class GradeRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const rs = await this.prisma.grade.findMany({
      include: {
        subject: true,

        student: {
          select: {
            student_id: true,
          },
        },
      },
    })

    const final = await Promise.all(
      rs.map(async (item) => {
        const class_id = await this.prisma.class.findFirst({
          where: {
            subject_id: item.subject_id,
          },
          select: {
            term: true,
            class_id: true,
            year: true,
          },
        })
        return {
          ...item,
          term: class_id.term,
          class_id: class_id.class_id,
          year: class_id.year,
        }
      }),
    )
    return final
  }

  calculateDigitScore(score: GradeToDBDto, credits: number) {
    const avgTheory = [
      score.theory_1,
      score.theory_2,
      score.theory_3,
      score.theory_4,
      score.theory_5,
    ]
    const lengthOfTheory = avgTheory.filter((item) => item !== undefined).length
    const sumOfTheory = avgTheory.reduce((acc, cur) => {
      return acc + (cur === undefined ? 0 : cur)
    }, 0)
    const avgOfTheory = sumOfTheory / lengthOfTheory

    const avgPractice = [
      score.practice_1,
      score.practice_2,
      score.practice_3,
      score.practice_4,
      score.practice_5,
    ]
    const lengthOfPractice = avgPractice.filter(
      (item) => item !== undefined,
    ).length
    const sumOfPractice = avgPractice.reduce((acc, cur) => {
      return acc + (cur === undefined ? 0 : cur)
    }, 0)
    const avgOfPractice = Number.isNaN(sumOfPractice / lengthOfPractice)
      ? undefined
      : sumOfPractice / lengthOfPractice
    let digitScore = 0
    if (avgOfPractice === undefined) {
      // only credit theory
      digitScore =
        (((avgOfTheory * 2 + score.midterm * 3 + score.final * 5) / 10) *
          credits) /
        credits
    } else {
      digitScore =
        (((avgOfTheory * 2 + score.midterm * 3 + score.final * 5) / 10) *
          (credits - 1) +
          avgOfPractice) /
        credits
    }

    return Math.round(digitScore * 10) / 10
  }

  async uploadGrade(data: GradeToDBDto) {
    const subject = await this.prisma.subject.findUnique({
      where: {
        subject_id: data.subject_id,
      },
      select: {
        credits: true,
      },
    })
    const digit = this.calculateDigitScore(data, subject.credits)
    const exist = await this.prisma.grade.findFirst({
      where: {
        student_id: data.student_id,
        subject_id: data.subject_id,
      },
      select: {
        final: true,
      },
    })
    if (exist.final > 4) {
      // student pass this subject
      return false
    }
    // student fail this subject or first time
    const rs = await this.prisma.grade.create({
      data: {
        digit_score: digit,
        letter_score: data.letter_score,
        subject_id: data.subject_id,
        student_id: data.student_id,
        ...data,
      },
      include: {
        subject: true,
      },
    })
    return rs
  }

  async getEnrolledSubjects(studentId: number) {
    const enrolledSubjects = await this.prisma.grade.findMany({
      where: {
        student_id: studentId,
      },
      select: {
        subject_id: true,
        digit_score: true,
      },
    })
    return enrolledSubjects
  }
}
