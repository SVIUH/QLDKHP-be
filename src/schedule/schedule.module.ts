import { Module } from '@nestjs/common'
import { ScheduleService } from './schedule.service'
import { ScheduleController } from './schedule.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import { ScheduleRepository } from './schedule.repository'
import { PrismaModule } from '../prisma/prisma.module'
import { CommonModule } from '../common/common.module'
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
  imports: [
    PrismaModule,
    CommonModule,
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
})
export class ScheduleModule {}
