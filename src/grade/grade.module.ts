import { Module } from '@nestjs/common'
import { GradeController } from './grade.controller'
import { GradeService } from './grade.service'
import { GradeRepository } from './grade.repository'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CommonModule } from '../common/common.module'
import { PrismaModule } from '../prisma/prisma.module'
import * as redisStore from 'cache-manager-redis-store'
import { UserModule } from '../user/user.module'
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [GradeController],
  providers: [GradeService, GradeRepository],
  imports: [
    PrismaModule,
    CommonModule,
    ConfigModule,
    UserModule,
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
  exports: [GradeService],
})
export class GradeModule {}
