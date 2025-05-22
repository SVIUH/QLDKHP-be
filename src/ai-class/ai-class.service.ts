import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { AI_CLASS_PROMPT } from './ai-prompt.provider';
@Injectable()
export class AiClassService {
  constructor(
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
    @Inject(AI_CLASS_PROMPT) private readonly sysPrompt: string,
  ) {}

  /* ─────────── 1.  CALL OPENAI  ─────────── */
  async callOpenAI(dto: CreateAiDto) {
    const body = {
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: this.sysPrompt },
        { role: 'user', content: JSON.stringify(dto) },
      ],
      temperature: 0.4,
      max_tokens: 1200,
      top_p: 1,
    };

    const res = await lastValueFrom(this.http.post('/chat/completions', body));

    try {
      return JSON.parse(res.data.choices[0].message.content.trim());
    } catch (e) {
      throw new BadRequestException('OpenAI response is not valid JSON');
    }
  }
  /* ─────────── 2.  SAVE TO DB (already present) ─────────── */
  public async saveMany(aiClasses: any[], dto: CreateAiDto) {
    const ready = aiClasses.map((c, i) => ({
      subject_id: dto.subject_id,
      term: dto.term,
      year: dto.year,
      class_name: c.class_name ?? `AUTO-${i + 1}`,
      professor_name: c.professor_name ?? '##TBD##',
      max_capacity: c.max_capacity ?? 60,
      status: true,
      isEnrolling: true,
      classDetails: c.classDetails,
    }));

    const inserted = await this.prisma.$transaction(
      ready.map((c) => {
        const { classDetails, ...data } = c;
        return this.prisma.class.create({
          data: {
            ...data,
            details: { createMany: { data: classDetails } },
          },
          include: { details: true },
        });
      }),
    );

    return inserted.map((row) => ({
      ...row,
      classDetails: row.details,
    }));
  }
}
