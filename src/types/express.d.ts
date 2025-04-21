import { JwtPayload } from "../interfaces/jwt-payload.interface";
import "express";

declare module "express" {
  export interface Request {
    user?: JwtPayload;
  }
}

// --- GIẢI THÍCH ---
// ✅ Mở rộng Request của Express để có thể sử dụng req.user
// ✅ Tự định nghĩa kiểu payload trong JwtPayload interface
// ✅ Dùng được trong mọi controller, không bị lỗi TS
