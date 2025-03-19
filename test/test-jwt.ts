import { sign, verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ file .env

const secretKey = process.env.JWT_SECRET; // Lấy JWT_SECRET từ .env

if (!secretKey) {
  console.error('Lỗi: JWT_SECRET không tồn tại trong file .env');
  process.exit(1);
}

console.log('✅ JWT_SECRET đã được load thành công.');

const testPayload = { userId: 123, role: 'admin' };

// 🔹 1. Tạo JWT Token
const token = sign(testPayload, secretKey, { expiresIn: '1h' });
console.log('🟢 Token đã tạo:', token);

// 🔹 2. Giải mã Token
try {
  const decoded = verify(token, secretKey);
  console.log('🟢 Token hợp lệ! Dữ liệu giải mã:', decoded);
} catch (error) {
  console.error('🔴 Token không hợp lệ:', error.message);
}