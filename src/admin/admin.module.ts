import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { JwtModule } from "@nestjs/jwt";
import * as redisStore from "cache-manager-ioredis";

import { AdminController } from "./controllers/admin.controller";
import { ClassController } from "./controllers/class.controller";
import { GradeController } from "./controllers/grade.controller";
import { ScheduleController } from "./controllers/schedule.controller";

import { AdminService } from "./services/admin.service";
import { AdminRepository } from "./repositories/admin.repository";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Redis cache global
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        url: "redis://localhost:6379",
      }),
    }),

    // ✅ JWT module global
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "default_secret",
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  controllers: [
    AdminController,
    ClassController,
    GradeController,
    ScheduleController,
  ],
  providers: [AdminService, AdminRepository, PrismaService],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
