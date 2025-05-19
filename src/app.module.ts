/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserController } from "./user/user.controller";
import { UserModule } from "./user/user.module";
import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CommonService } from "./common/common.service";
import { Valid } from "./utils/validUser";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnrollmentModule } from "./enrollment/enrollment.module";
import { SubjectModule } from "./subject/subject.module";
import { AppController } from "./app.controller";
import { ClassModule } from "./class/class.module";
import { GradeModule } from "./grade/grade.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { CacheModule } from "@nestjs/cache-manager";
import { AppService } from "./app.service"; // Nhập AppService ở đây
import { AdminModule } from "./admin/admin.module";
import { PrismaService } from "./prisma/prisma.service";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    UserModule,
    AdminModule,
    PrismaModule,
    EnrollmentModule,
    ClassModule,
    GradeModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>("REDIS_HOST"),
        port: configService.get<number>("REDIS_PORT"),
        username: configService.get<string>("REDIS_USERNAME"),
        password: configService.get<string>("REDIS_PASSWORD"),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get("REDIS_HOST"),
          port: config.get("REDIS_PORT"),
          password: config.get("REDIS_PASSWORD"),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SubjectModule,
    ScheduleModule,
    ChatModule,
  ],
  providers: [
    AppService,
    PrismaService, // Thêm AppService vào providers
    CommonService,
    {
      provide: "VALID",
      useClass: Valid,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
  controllers: [UserController, AppController],
})
export class AppModule {}
