import { CommonService } from '../common/common.service'
import { SubjectToDBDto } from './dto/subject.db.dto'
import { SubjectRepository } from './subject.repository'
import { Injectable, Inject} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly commonService: CommonService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createSubject(data: SubjectToDBDto) {
    const created = await this.subjectRepository.createSubject({
      prerequisites: data.prerequisites.map((item) => ({
        ...item,
        prerequisite_id: this.commonService.generateId(),
      })),
      subject: {
        ...data.subject,
        subject_id: this.commonService.generateId(),
      },
    });

    // ❗ Xóa cache để dữ liệu mới được load lên FE
    await this.cacheManager.del('subjects:all');

    return created;
  }

  async getAllSubjects(student_id: number) {
    const cacheKey = 'subjects:all';
    const cached = await this.cacheManager.get<any[]>(cacheKey);
    if (cached) return cached;

    const rs = await this.subjectRepository.getAllSubjects();
    const final = rs.map((item) => {
      const grades = item.grades.filter((g) => g.student_id === student_id);
      const status = grades[0]?.digit_score >= 4 || false;

      return {
        ...item,
        status,
        prerequisites: this.commonService.deleteField(item.prerequisites, ['subject_id', 'prerequisite_id']),
        ...this.commonService.deleteField(item, ['grades']),
      };
    });

    await this.cacheManager.set(cacheKey, final, 60); // cache 60s
    return final;
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
