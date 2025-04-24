import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { CreateClassDto, UpdateClassDto } from "../dto/class.dto";
import { UpdateGradeDto } from "../dto/grade.dto";
import { CreateScheduleDto, UpdateScheduleDto } from "../dto/schedule.dto";
import { AdminRepository } from "../repositories/admin.repository";
import { UpdateStudentDto } from "../dto/student.dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException("Email và mật khẩu không được để trống");
    }

    const admin = await this.adminRepository.findAdminByEmail(email);
    if (!admin) {
      throw new UnauthorizedException("Tài khoản không tồn tại");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException("Sai mật khẩu");
    }

    const token = this.jwtService.sign({
      adminId: admin.admin_id,
      email: admin.email,
    });

    return { access_token: token };
  }

  async getAllClassesWithFilter(filter?: {
    year?: number;
    term?: number;
    subject_id?: number;
  }) {
    return this.adminRepository.getAllClasses(filter);
  }

  async createClass(data: CreateClassDto) {
    const created = await this.adminRepository.createClass(data);
    await this.cacheManager.del("classes:all");
    return created;
  }

  async updateClass(class_id: number, data: UpdateClassDto) {
    const updated = await this.adminRepository.updateClass(class_id, data);
    await this.cacheManager.del("classes:all");
    return updated;
  }

  async deleteClass(class_id: number) {
    const deleted = await this.adminRepository.deleteClass(class_id);
    await this.cacheManager.del("classes:all");
    return deleted;
  }

  async updateGrade(data: UpdateGradeDto) {
    const updated = await this.adminRepository.updateGrade(data);
    await this.cacheManager.del(`grades:${data.student_id}`);
    return updated;
  }

  async createSchedule(data: CreateScheduleDto) {
    const created = await this.adminRepository.createSchedule(data);
    await this.cacheManager.del(`schedule:${data.student_id}`);
    await this.cacheManager.del("schedules:all");
    return created;
  }

  async updateSchedule(schedule_id: number, data: UpdateScheduleDto) {
    const updated = await this.adminRepository.updateSchedule(schedule_id, {
      time: data.time,
    });
    await this.cacheManager.del("schedules:all");
    await this.cacheManager.del(`schedule:${updated.student_id}`);
    return updated;
  }

  async deleteSchedule(schedule_id: number) {
    const deleted = await this.adminRepository.deleteSchedule(schedule_id);
    await this.cacheManager.del(`schedule:${deleted.student_id}`);
    await this.cacheManager.del("schedules:all");
    return deleted;
  }

  async getAllSchedules() {
    const cacheKey = "schedules:all";
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const data = await this.adminRepository.getAllSchedules();
    await this.cacheManager.set(cacheKey, data, 300);
    return data;
  }

  async getGradesByStudent(student_id: number) {
    const cacheKey = `grades:${student_id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const data = await this.adminRepository.getGradesByStudent(student_id);
    await this.cacheManager.set(cacheKey, data, 300);
    return data;
  }

  async getSchedulesByStudent(student_id: number) {
    const cacheKey = `schedule:${student_id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const data = await this.adminRepository.getSchedulesByStudent(student_id);
    await this.cacheManager.set(cacheKey, data, 300);
    return data;
  }

  async getAllStudents() {
    const cacheKey = "students:all";
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const data = await this.adminRepository.getAllStudents();
    await this.cacheManager.set(cacheKey, data, 300);
    return data;
  }

  async updateStudent(student_id: number, data: UpdateStudentDto) {
    const updated = await this.adminRepository.updateStudent(student_id, data);
    await this.cacheManager.del("students:all");
    return updated;
  }

  async deleteStudent(student_id: number) {
    const deleted = await this.adminRepository.deleteStudent(student_id);
    await this.cacheManager.del("students:all");
    await this.cacheManager.del(`grades:${student_id}`);
    await this.cacheManager.del(`schedule:${student_id}`);
    return deleted;
  }
}

// --- GIẢI THÍCH ---
// Sử dụng JwtService chuẩn để tạo access_token
// Redis cache áp dụng cho: getAllClasses, getAllSchedules, getAllStudents, getGradesByStudent, getSchedulesByStudent
// Các hàm thêm/sửa/xóa sẽ tự động xóa cache liên quan để đảm bảo dữ liệu mới
