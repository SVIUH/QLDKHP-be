/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { Tx } from '../common/common.type'
import { PrismaService } from '../prisma/prisma.service'
import { UserCreateDto } from './dto/userCreate.dto'
import { UserUpdateDto } from './dto/userUpdate.dto'
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(student_id: number, prisma: Tx = this.prisma) {
    const user = await prisma.student.findUnique({
      where: {
        student_id,
      },
    })
    return user
  }

  async findAll(prisma: Tx = this.prisma) {
    const users = await prisma.student.findMany({})
    return users
  }

  async getUserCode(code: number, prisma: Tx = this.prisma) {
    const user = await prisma.student.findUnique({
      where: {
        code,
      },
      include: {
        education: true,
      },
    })
    return user
  }

  async createUser(userCreateDto: UserCreateDto, prisma: Tx = this.prisma) {
    const user = await prisma.student.create({
      data: {
        ...userCreateDto,
        student_id: userCreateDto.code,
        status: 'active',
        education: {
          create: {
            ...userCreateDto.education,
          },
        },
      },
    })

    if (!user) {
      return false
    }

    return true
  }

  async updateUser(
    student_id: number,
    userUpdateDto: UserUpdateDto,
    prisma: Tx = this.prisma,
  ) {
    const user = await prisma.student.update({
      where: {
        student_id,
      },
      data: {
        password: userUpdateDto.password,
        // total_credits let increase the total credit of the student
        total_credits: {
          increment: userUpdateDto.credit,
        },
      },
    })

    if (!user) {
      return false
    }

    return true
  }
}
