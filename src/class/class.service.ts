import { Injectable } from '@nestjs/common'
import { CommonService } from '../common/common.service'
import { ClassRepository } from './class.repository'
import { ClassToDBDto } from './dto/class.db.dto'
import { SubjectService } from '../subject/subject.service'
import { GradeService } from '../grade/grade.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue as QueueEmail } from 'bull'

@Injectable()
export class ClassService {
  private readonly TIME_STUDY = ['1-3', '4-6', '7-9', '10-12', '13-15']
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly commonService: CommonService,
    private readonly subjectService: SubjectService,
    private readonly gradeService: GradeService,
    @InjectQueue('queue')
    private readonly mailQueue: QueueEmail,
  ) {}

  async createClass(data: ClassToDBDto) {
    const class_details = data.class_details.map((item) => {
      return {
        ...item,
        class_detail_id: this.commonService.generateId(),
      }
    })

    const inputData = {
      ...data,
      class_id: this.commonService.generateId(),
      class_details,
    }
    const rs = await this.classRepository.create(inputData)
    return rs
  }

  async getAllClasses(raw: string) {
    const rawSplit = raw.split('-')
    const term = rawSplit[0]
    const year = rawSplit[1]
    const rs = await this.classRepository.getAll()
    const final = await Promise.all(
      rs
        .filter((item) => {
          return item.term === parseInt(term) && item.year === parseInt(year)
        })
        .map(async (item) => {
          const prerequisites = await this.subjectService.getSubjectById(
            item.subject_id,
          )

          return this.commonService.deleteField(
            {
              ...item,
              subject: {
                ...item.subject,
                ...prerequisites,
              },
            },
            ['prerequisite_id'],
          )
        }),
    )
    const groupBySubjectId = this.groupBySubjectId(final)
    return groupBySubjectId
  }

  private groupBySubjectId = (data: any) => {
    const result = []
    const map = new Map()

    for (const item of data) {
      if (!map.has(item.subject_id)) {
        map.set(item.subject.subject_id, [])
        result.push(map.get(item.subject.subject_id))
      }
      map.get(item.subject.subject_id).push(item)
    }
    const final = []

    result.map((item) => {
      const obj = {}
      obj['class'] = item
      obj['subject'] = item[0].subject

      final.push(obj)
    })

    return final
  }

  async closeRegisterClass(subject_id: number) {
    const rs = await this.classRepository.closeRegister(subject_id)
    if (rs) {
      rs.map(async (item) => {
        await this.mailQueue.add(
          'register',
          {
            to: item.email,
            name: item.student_name,
          },
          {
            removeOnComplete: true,
          },
        )
      })
      return true
    } else {
      return false
    }
  }

  async checkCapacityOfClass(classId: number) {
    const rs = await this.classRepository.checkCapacityOfClass(classId)
    return rs
  }

  async getClassById(classId: number) {
    const rs = await this.classRepository.getClassById(classId) //classRegistion
    return rs
  }

  async checkPrerequisite(classId: number, studentId: number) {
    const classRegistion = await this.classRepository.getClassById(classId)
    const subjectOfClass = classRegistion.subject

    const subject = await this.subjectService.getSubjectById(
      subjectOfClass.subject_id,
    )

    const prerequisites = subject.prerequisites

    const enrolledSubjects = await this.gradeService.enrolledSubjects(studentId)

    const hasEnrolledInAllPrerequisites = prerequisites.every((prerequisite) =>
      enrolledSubjects.some(
        (enrolledSubject) =>
          enrolledSubject.subject_id === prerequisite.prerequisite_subject_id &&
          this.commonService.checkDigitScore(enrolledSubject.digit_score),
      ),
    )

    return hasEnrolledInAllPrerequisites
  }
}
