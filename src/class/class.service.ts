import { Injectable, Inject } from '@nestjs/common'
import { CommonService } from '../common/common.service'
import { ClassRepository } from './class.repository'
import { ClassToDBDto } from './dto/class.db.dto'
import { SubjectService } from '../subject/subject.service'
import { GradeService } from '../grade/grade.service'
import { ScheduleService } from '../schedule/schedule.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue as QueueEmail } from 'bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ClassService {
  private readonly TIME_STUDY = ['1-3', '4-6', '7-9', '10-12', '13-15']
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly commonService: CommonService,
    private readonly subjectService: SubjectService,
    private readonly gradeService: GradeService,
    private readonly scheduleService: ScheduleService,
    @InjectQueue('queue')
    private readonly mailQueue: QueueEmail,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    await this.cacheManager.del('classes:all')
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

  async getClassesWithSchedules(subject_id: number) {
    // Lấy tất cả các lớp học của môn học
    const classes = await this.classRepository.getClassesBySubjectId(subject_id)

    // Lấy lịch học của từng lớp
    const classesWithSchedules = await Promise.all(
      classes.map(async (classItem) => {
        const schedules = await this.scheduleService.getSchedulesByClassId(classItem.class_id)

        // Kết hợp thông tin lớp học với lịch học
        return {
          ...classItem,
          schedules,
        }
      }),
    )

    return classesWithSchedules
  }

  async getClassesBySubjectWithSchedules(subject_id: number) {
  const classes = await this.classRepository.findManyBySubject(subject_id);

  const result = await Promise.all(
      classes.map(async (cls) => {
        const schedules = await this.scheduleService.getSchedulesByClassId(cls.class_id);

        return {
          ...cls,
          schedules,
          class_details: cls.details.map(detail => ({
            class_detail_id: detail.class_detail_id,
            study_time: detail.study_time,
            group_practice: detail.group_practice,
            room_name: detail.room_name,
            towner: detail.towner,
            // Thêm các trường khác nếu cần
          })),
        };
      }),
    );

    return result;
  }
}
