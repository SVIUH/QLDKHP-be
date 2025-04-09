// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";
// import * as dotenv from "dotenv";

// dotenv.config(); // Nạp các biến môi trường từ tệp .env

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
// 📁 src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

dotenv.config(); // Nạp các biến môi trường từ tệp .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Thêm Swagger mà không ảnh hưởng phần còn lại
  const config = new DocumentBuilder()
    .setTitle("Quản lý học phần - Admin API")
    .setDescription("Tài liệu Swagger cho hệ thống Admin")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document); // Truy cập tại /api/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
