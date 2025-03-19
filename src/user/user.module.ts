import { BullModule } from '@nestjs/bull'
import { CacheModule, Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import * as redisStore from 'cache-manager-redis-store'
import { AuthModule } from '../auth/auth.module'
import { CommonModule } from '../common/common.module'
import { EmailConsumer } from '../consumers/queue.consummer'
import { PrismaModule } from '../prisma/prisma.module'
import { UserCheck } from './user.check'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'
import { SubjectModule } from '../subject/subject.module'
@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserCheck, EmailConsumer],
  imports: [
    forwardRef(() => AuthModule),
    PrismaModule,
    CommonModule,
    ConfigModule,
    SubjectModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
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
    BullModule.registerQueue({
      name: 'queue',
    }),
  ],
  exports: [UserService, UserCheck],
})
export class UserModule {}
