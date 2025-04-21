import { Injectable } from '@nestjs/common'
import { CreateScheduleDto } from './dto/create-schedule-dto'
import { UpdateScheduleDto } from './dto/update.schedule.dto'
import { ScheduleToDBDto } from './dto/schedule.db.dto'
import { ScheduleRepository } from './schedule.repository'
import { CommonService } from '../common/common.service'

@Injectable()
export class ScheduleService {
  private readonly shifts = [
    'T1 -> T3',
    'T4 -> T6',
    'T7 -> T9',
    'T10 -> T12',
    'T13 -> T15',
  ]
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly commonService: CommonService,
  ) {}

  create(createScheduleDto: ScheduleToDBDto) {
    return this.scheduleRepository.createSchedule({
      ...createScheduleDto,
      schedule_id: this.commonService.generateId(),
    })
  }

  async findAll(student_id: number) {
    const rs = await this.scheduleRepository.getAllSchedule(student_id)
    return rs.map((item) => {
      const rawShift = item.class.class_detail.study_time.split('(')[1]
      const shift = rawShift.slice(0, rawShift.length - 1)
      const i = {
        ...item,
        shift: this.shifts.indexOf(shift),
        time: this.commonService.formatDate(item.time),
      }
      return this.commonService.deleteField(i, [
        'isEnrolling',
        'status',
        'enrollments',
      ])
    })
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleRepository.updateSchedule(id, updateScheduleDto)
  }

  remove(id: number) {
    return this.scheduleRepository.deleteSchedule(id)
  }
}

// LT - Thứ 7(T10 -> T12)
