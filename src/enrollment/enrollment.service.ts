/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import { CommonService } from '../common/common.service'
import { EnrollmentRepository } from './enrollment.repository'
import { EnrollmentToDBDto } from './dto/enrollment.dt.dto'
import { ClassService } from '../class/class.service'
import { SubjectService } from '../subject/subject.service'
import { CacheModule } from '@nestjs/cache-manager';

@Injectable()
export class EnrollmentService {
  constructor(
    private commonService: CommonService,
    private subjectService: SubjectService,
    private classService: ClassService,
    private enrollmentRepository: EnrollmentRepository,
  ) {}

  async create(data: EnrollmentToDBDto) {
    const isClassFull = await this.classService.checkCapacityOfClass(
      data.class_id,
    )
    if (!isClassFull) {
      //pass
      console.log('class is full')
      return false
    }

    const creditOfSubject = await this.subjectService.currentCreditOfSubject(
      data.class_id,
    )

    const hasPrerequisite = await this.classService.checkPrerequisite(
      data.class_id,
      data.student_id,
    )
    if (!hasPrerequisite) {
      //pass
      console.log('prerequisite not met')
      return false
    }
    return await this.enrollmentRepository.create(
      {
        ...data,
        enrollment_id: this.commonService.generateId(),
      },
      creditOfSubject,
    )
  }

  async getAllEnrollments(student_id: number, raw: string) {
    const rawSplit = raw.split('-')
    const term = rawSplit[0]
    const year = rawSplit[1]
    const rs = await this.enrollmentRepository.getAllEnrollments(student_id)
    const final = rs.filter((item) => {
      return (
        item.class.term === parseInt(term) && item.class.year === parseInt(year)
      )
    })
    return final
  }
}
