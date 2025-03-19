import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { SubjectController } from './subject.controller'
import { SubjectService } from './subject.service'
import { SubjectRepository } from './subject.repository'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CommonModule } from '../common/common.module'
import { PrismaModule } from '../prisma/prisma.module'
import * as redisStore from 'cache-manager-redis-store'

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, SubjectRepository],
  imports: [
    PrismaModule,
    CommonModule,
    ConfigModule,
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
  exports: [SubjectService],
})
export class SubjectModule {}
