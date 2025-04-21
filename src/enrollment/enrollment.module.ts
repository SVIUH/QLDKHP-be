import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CommonModule } from '../common/common.module'
import { PrismaModule } from '../prisma/prisma.module'
import { EnrollmentController } from './enrollment.controller'
import { EnrollmentRepository } from './enrollment.repository'
import { EnrollmentService } from './enrollment.service'
import * as redisStore from 'cache-manager-redis-store'
import { ClassModule } from '../class/class.module'
import { SubjectModule } from '../subject/subject.module'
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository],
  imports: [
    PrismaModule,
    CommonModule,
    ConfigModule,
    ClassModule,
    SubjectModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
      }),
    }),
  ],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
