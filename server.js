const express = require('express');
const { NlpManager } = require('node-nlp');
const fs = require('fs');
const cors = require('cors');

// Khởi tạo server và NLP manager
const app = express();
const nlp = new NlpManager({ languages: ['vi'], threshold: 0.4 });
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Đọc dữ liệu từ curriculum.json
const curriculum = JSON.parse(fs.readFileSync('curriculum.json', 'utf-8'));

// Hàm tìm môn học theo mã môn học
function findCourseByCode(code) {
  for (const semester of curriculum.hocKy) {
    const requiredCourses = semester.required.courses || [];
    const electiveCourses = semester.electives?.courses || [];
    const allCourses = [...requiredCourses, ...electiveCourses];
    const course = allCourses.find((c) => c.maMonHoc === code);
    if (course) return course;
  }
  return null;
}

// Hàm tìm môn học theo tên (khớp gần đúng)
function findCourseByName(name) {
  const allCourses = curriculum.hocKy.flatMap((hk) => [
    ...(hk.required.courses || []),
    ...(hk.electives?.courses || []),
  ]);
  return allCourses.find((c) => c.tenMonHoc.toLowerCase().includes(name.toLowerCase()));
}

// Hàm tìm môn học tiên quyết
function findPrerequisites(courseCode) {
  const course = findCourseByCode(courseCode);
  if (!course || !course.hocPhanHocTruoc) return [];

  const prereqCodes = course.hocPhanHocTruoc
    .split(',')
    .map((code) => code.trim().replace('(a)', ''))
    .filter((code) => code);

  return prereqCodes.map((code) => findCourseByCode(code)).filter((c) => c);
}

// Hàm kiểm tra điều kiện đăng ký môn học ở học kỳ cụ thể
function checkCourseEligibility(semesterName, courseCode) {
  const semester = curriculum.hocKy.find((hk) => hk.tenHocKy === semesterName);
  if (!semester) return 'Học kỳ không tồn tại.';

  const requiredCourses = semester.required.courses || [];
  const electiveCourses = semester.electives?.courses || [];
  const allCourses = [...requiredCourses, ...electiveCourses];
  const course = allCourses.find((c) => c.maMonHoc === courseCode);

  if (!course) return 'Môn học không có trong học kỳ này.';

  const prereqs = findPrerequisites(courseCode);
  if (prereqs.length === 0) return 'Bạn đủ điều kiện đăng ký môn này.';
  return `Để đăng ký ${course.tenMonHoc}, bạn cần hoàn thành các môn tiên quyết: ${prereqs
    .map((p) => p.tenMonHoc)
    .join(', ')}.`;
}

// Hàm trích xuất mã môn học bằng regex
function extractCourseCode(question) {
  const regex = /\b(\d{6})\b/;
  const match = question.match(regex);
  return match ? match[1] : null;
}

// Hàm trích xuất tên môn học từ câu hỏi
function extractCourseName(question) {
  // Loại bỏ các từ khóa không cần thiết
  const keywords = ['muốn học môn', 'cần học những môn gì', 'tên môn học', 'mã môn', 'mã mh', 'là gì'];
  let cleanedQuestion = question.toLowerCase();
  for (const keyword of keywords) {
    cleanedQuestion = cleanedQuestion.replace(keyword, '').trim();
  }
  return cleanedQuestion;
}

// Đào tạo mô hình NLP
nlp.addDocument('vi', 'Mã môn học %code% ứng với môn học gì', 'course.lookup');
nlp.addDocument('vi', 'Mã MH %code% tên là gì', 'course.lookup');
nlp.addDocument('vi', 'Mã môn %code% là môn gì', 'course.lookup');
nlp.addDocument('vi', 'Tên môn học mã %code% là gì', 'course.lookup');
nlp.addDocument('vi', 'Mã %code% là môn gì', 'course.lookup');
nlp.addDocument('vi', 'Tôi muốn hỏi tên môn học %code%', 'course.lookup');
nlp.addDocument('vi', 'Môn %code% tên gì', 'course.lookup');
nlp.addDocument('vi', 'Muốn học môn %courseName% cần học những môn gì', 'course.prerequisites');
nlp.addDocument('vi', 'Để học môn %courseName% cần học gì', 'course.prerequisites');
nlp.addDocument('vi', 'Môn %courseName% cần học trước những môn gì', 'course.prerequisites');
nlp.addDocument('vi', 'Học kỳ %semester% đăng ký môn %courseName% đã đủ chưa', 'course.eligibility');

// Định nghĩa entity cho code
nlp.addRegexEntity('code', 'vi', /\b\d{6}\b/);

// Định nghĩa entity cho courseName (dựa trên danh sách môn học)
const allCourseNames = curriculum.hocKy
  .flatMap((hk) => [...(hk.required.courses || []), ...(hk.electives?.courses || [])])
  .map((c) => c.tenMonHoc.toLowerCase());
allCourseNames.forEach((name) => {
  nlp.addNamedEntityText('courseName', name, ['vi'], [name]);
});

nlp.addAnswer('vi', 'course.lookup', 'Môn học có mã %code% là %courseName%.');
nlp.addAnswer('vi', 'course.prerequisites', 'Để học môn %courseName%, bạn cần học các môn tiên quyết: %prereqs%.');
nlp.addAnswer('vi', 'course.eligibility', '%eligibility%');

// API xử lý câu hỏi
app.post('/chat', async (req, res) => {
  const { question } = req.body;
  const response = await nlp.process('vi', question);

  // Log để debug
  console.log('Question:', question);
  console.log('NLP Response:', response);
  console.log('Entities:', response.entities);

  let answer = 'Tôi không hiểu câu hỏi của bạn. Vui lòng thử lại!';
  if (response.intent === 'course.lookup') {
    const code = extractCourseCode(question);
    console.log('Extracted code:', code);

    const course = findCourseByCode(code);
    if (course) {
      answer = `Môn học có mã ${code} là ${course.tenMonHoc}.`;
    } else {
      answer = `Không tìm thấy môn học với mã ${code || 'không xác định'}.`;
    }
  } else if (response.intent === 'course.prerequisites') {
    // Thử lấy courseName từ NLP entity
    let courseName = response.entities.find((e) => e.entity === 'courseName')?.option;
    
    // Nếu không tìm thấy courseName từ NLP, sử dụng extractCourseName
    if (!courseName) {
      courseName = extractCourseName(question);
      console.log('Extracted courseName:', courseName);
    }

    const course = findCourseByName(courseName);
    if (course) {
      const prereqs = findPrerequisites(course.maMonHoc);
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
    const courseName = response.entities.find((e) => e.entity === 'courseName')?.option || extractCourseName(question);
    
    const course = findCourseByName(courseName);
    if (course && semester) {
      answer = checkCourseEligibility(semester, course.maMonHoc);
    } else {
      answer = `Không tìm thấy môn học ${courseName || 'không xác định'} hoặc học kỳ ${semester || 'không xác định'}.`;
    }
  }

  res.json({ answer });
});

// Khởi động server
(async () => {
  await nlp.train();
  app.listen(5000, () => {
    console.log('Chatbot server running on port 5000');
  });
})();