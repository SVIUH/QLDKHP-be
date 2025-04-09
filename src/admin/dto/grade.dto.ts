export class UpdateGradeDto {
  student_id: number;
  subject_id: number;
  midterm?: number;
  final?: number;
}
