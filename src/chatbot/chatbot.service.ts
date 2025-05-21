import { Injectable, OnModuleInit } from '@nestjs/common';
import { NlpManager } from 'node-nlp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ChatbotService implements OnModuleInit {
  private nlp: NlpManager;
  private curriculum: any;

  async onModuleInit() {
    this.nlp = new NlpManager({ languages: ['vi'], threshold: 0.4 });

    const dataPath = path.join(__dirname, '../../data/curriculum.json');
    this.curriculum = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Tất cả các mẫu câu NLP
    this.nlp.addDocument('vi', 'Mã môn học %code% ứng với môn học gì', 'course.lookup');
    this.nlp.addDocument('vi', 'Mã MH %code% tên là gì', 'course.lookup');
    this.nlp.addDocument('vi', 'Mã môn %code% là môn gì', 'course.lookup');
    this.nlp.addDocument('vi', 'Tên môn học mã %code% là gì', 'course.lookup');
    this.nlp.addDocument('vi', 'Mã %code% là môn gì', 'course.lookup');
    this.nlp.addDocument('vi', 'Tôi muốn hỏi tên môn học %code%', 'course.lookup');
    this.nlp.addDocument('vi', 'Môn %code% tên gì', 'course.lookup');

    this.nlp.addDocument('vi', 'Muốn học môn %courseName% cần học những môn gì', 'course.prerequisites');
    this.nlp.addDocument('vi', 'Để học môn %courseName% cần học gì', 'course.prerequisites');
    this.nlp.addDocument('vi', 'Môn %courseName% cần học trước những môn gì', 'course.prerequisites');
    this.nlp.addDocument('vi', 'Học kỳ %semester% đăng ký môn %courseName% đã đủ chưa', 'course.eligibility');

    // Regex entity cho mã môn học
    this.nlp.addRegexEntity('code', 'vi', /\b\d{6}\b/);

    // Thêm courseName entity
    const allCourseNames = this.curriculum.hocKy
      .flatMap((hk) => [...(hk.required.courses || []), ...(hk.electives?.courses || [])])
      .map((c) => c.tenMonHoc.toLowerCase());
    allCourseNames.forEach((name) => {
      this.nlp.addNamedEntityText('courseName', name, ['vi'], [name]);
    });

    // Câu trả lời mặc định cho NLP
    this.nlp.addAnswer('vi', 'course.lookup', 'Môn học có mã %code% là %courseName%.');
    this.nlp.addAnswer('vi', 'course.prerequisites', 'Để học môn %courseName%, bạn cần học các môn tiên quyết: %prereqs%.');
    this.nlp.addAnswer('vi', 'course.eligibility', '%eligibility%');

    await this.nlp.train();
  }

  async handleQuestion(question: string): Promise<{ answer: string }> {
    const response = await this.nlp.process('vi', question);

    let answer = 'Tôi không hiểu câu hỏi của bạn. Vui lòng thử lại!';

    if (response.intent === 'course.lookup') {
      const code = this.extractCourseCode(question);
      const course = this.findCourseByCode(code);
      if (course) {
        answer = `Môn học có mã ${code} là ${course.tenMonHoc}.`;
      } else {
        answer = `Không tìm thấy môn học với mã ${code || 'không xác định'}.`;
      }
    } else if (response.intent === 'course.prerequisites') {
      let courseName = response.entities.find((e) => e.entity === 'courseName')?.option;
      if (!courseName) {
        courseName = this.extractCourseName(question);
      }
      const course = this.findCourseByName(courseName);
      if (course) {
        const prereqs = this.findPrerequisites(course.maMonHoc);
        if (prereqs.length > 0) {
          answer = `Để học môn ${course.tenMonHoc}, bạn cần học các môn tiên quyết: ${prereqs
            .map((p) => p.tenMonHoc)
            .join(', ')}.`;
        } else {
          answer = `Môn ${course.tenMonHoc} không yêu cầu môn tiên quyết.`;
        }
      } else {
        answer = `Không tìm thấy môn học ${courseName || 'không xác định'}.`;
      }
    } else if (response.intent === 'course.eligibility') {
      const semester = response.entities.find((e) => e.entity === 'semester')?.option;
      const courseName = response.entities.find((e) => e.entity === 'courseName')?.option || this.extractCourseName(question);
      const course = this.findCourseByName(courseName);
      if (course && semester) {
        answer = this.checkCourseEligibility(semester, course.maMonHoc);
      } else {
        answer = `Không tìm thấy môn học ${courseName || 'không xác định'} hoặc học kỳ ${semester || 'không xác định'}.`;
      }
    }

    return { answer };
  }

  private extractCourseCode(question: string): string | null {
    const match = question.match(/\b(\d{6})\b/);
    return match ? match[1] : null;
  }

  private extractCourseName(question: string): string {
    const keywords = ['muốn học môn', 'cần học những môn gì', 'tên môn học', 'mã môn', 'mã mh', 'là gì'];
    let cleaned = question.toLowerCase();
    for (const keyword of keywords) {
      cleaned = cleaned.replace(keyword, '').trim();
    }
    return cleaned;
  }

  private findCourseByCode(code: string) {
    for (const semester of this.curriculum.hocKy) {
      const allCourses = [
        ...(semester.required.courses || []),
        ...(semester.electives?.courses || []),
      ];
      const course = allCourses.find((c) => c.maMonHoc === code);
      if (course) return course;
    }
    return null;
  }

  private findCourseByName(name: string) {
    const allCourses = this.curriculum.hocKy.flatMap((hk) => [
      ...(hk.required.courses || []),
      ...(hk.electives?.courses || []),
    ]);
    return allCourses.find((c) => c.tenMonHoc.toLowerCase().includes(name.toLowerCase()));
  }

  private findPrerequisites(courseCode: string) {
    const course = this.findCourseByCode(courseCode);
    if (!course || !course.hocPhanHocTruoc) return [];

    const prereqCodes = course.hocPhanHocTruoc
      .split(',')
      .map((code) => code.trim().replace('(a)', ''))
      .filter((code) => code);

    return prereqCodes.map((code) => this.findCourseByCode(code)).filter((c) => c);
  }

  private checkCourseEligibility(semesterName: string, courseCode: string): string {
    const semester = this.curriculum.hocKy.find((hk) => hk.tenHocKy === semesterName);
    if (!semester) return 'Học kỳ không tồn tại.';

    const allCourses = [
      ...(semester.required.courses || []),
      ...(semester.electives?.courses || []),
    ];
    const course = allCourses.find((c) => c.maMonHoc === courseCode);

    if (!course) return 'Môn học không có trong học kỳ này.';

    const prereqs = this.findPrerequisites(courseCode);
    if (prereqs.length === 0) return 'Bạn đủ điều kiện đăng ký môn này.';
    return `Để đăng ký ${course.tenMonHoc}, bạn cần hoàn thành các môn tiên quyết: ${prereqs
      .map((p) => p.tenMonHoc)
      .join(', ')}.`;
  }
}
