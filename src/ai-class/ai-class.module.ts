// ai-class.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AiClassController } from './ai-class.controller';
import { AiClassService } from './ai-class.service';
import { AiPromptProvider } from './ai-prompt.provider';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        baseURL: 'https://api.openai.com/v1',
        timeout: 15_000,
        headers: {
          Authorization: `Bearer ${cfg.get<string>('OPENAI_KEY')}`,
        },
      }),
    }),
  ],
  controllers: [AiClassController],
  providers: [AiClassService, PrismaService, AiPromptProvider],
})
export class AiClassModule {}
