import { AuthService } from '../src/auth/auth.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Load biến môi trường từ file .env

console.log("✅ Giá trị JWT_SECRET:", process.env.JWT_SECRET);

const authService = new AuthService();

async function test() {
  console.log('✅ Bắt đầu kiểm tra AuthService...');

  // 1. Kiểm tra băm mật khẩu
  const password = '123456';
  const hashedPassword = await authService.hashPassword(password);
  console.log('🔵 Mật khẩu băm:', hashedPassword);

  // 2. Kiểm tra xác thực mật khẩu
  const isValid = await authService.validatePassword(password, hashedPassword);
  console.log(isValid ? '🟢 Mật khẩu hợp lệ!' : '🔴 Mật khẩu không hợp lệ!');

  // 3. Kiểm tra tạo JWT Token
  try {
    const jwtToken = authService.generateJWT(1234);
    console.log('🟢 JWT Token:', jwtToken);

    // 4. Kiểm tra giải mã JWT Token
    const decoded = authService.decodeJWT(jwtToken);
    console.log('🟢 Token hợp lệ! Dữ liệu:', decoded);
  } catch (error) {
    console.error('🔴 Lỗi khi tạo hoặc giải mã JWT:', error.message);
  }
}

test().catch(console.error);