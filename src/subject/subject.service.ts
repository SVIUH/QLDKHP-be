import { CommonService } from '../common/common.service'
import { SubjectToDBDto } from './dto/subject.db.dto'
import { SubjectRepository } from './subject.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly commonService: CommonService,
  ) {}

  async createSubject(data: SubjectToDBDto) {
    return this.subjectRepository.createSubject({
      prerequisites: data.prerequisites.map((item) => {
        return {
          ...item,
          prerequisite_id: this.commonService.generateId(),
        }
      }),
      subject: {
        ...data.subject,
        subject_id: this.commonService.generateId(),
      },
    })
  }

  async getAllSubjects(student_id: number) {
    const rs = await this.subjectRepository.getAllSubjects()
    const final = rs.map((item) => {
      const grades = item.grades.filter(
        (grade) => grade.student_id === student_id,
      )
      let status: boolean = false
      if (grades[0] !== undefined) {
        const digit = grades[0].digit_score
        if (digit >= 4) {
          status = true
        } else {
          status = false
        }
      }
      return {
        ...item,
        status,
      }
    })
    final.map((r) => {
      const prerequisites = this.commonService.deleteField(r.prerequisites, [
        'subject_id',
        'prerequisite_id',
      ])

      r.prerequisites = prerequisites
      return this.commonService.deleteField(r, ['grades'])
    })
    return final
  }

  //get credit of object to enroll
  async currentCreditOfSubject(class_id: number) {
    const rs = await this.subjectRepository.currentCredit(class_id)
    return rs.subject.credits
  }

  async getSubjectById(subjectId: number) {
    const rs = await this.subjectRepository.getSubjectById(subjectId)
    return rs
  }
}
