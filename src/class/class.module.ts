import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import { CommonModule } from '../common/common.module'
import { PrismaModule } from '../prisma/prisma.module'
import { ClassController } from './class.controller'
import { ClassRepository } from './class.repository'
import { ClassService } from './class.service'
import { SubjectModule } from '../subject/subject.module'
import { GradeModule } from '../grade/grade.module'
import { BullModule } from '@nestjs/bull'
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [ClassController],
  providers: [ClassService, ClassRepository],
  imports: [
    PrismaModule,
    CommonModule,
    ConfigModule,
    SubjectModule,
    GradeModule,
    BullModule.registerQueue({
      name: 'queue',
    }),
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
  exports: [ClassService],
})
export class ClassModule {}
