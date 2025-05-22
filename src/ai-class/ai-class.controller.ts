import { Body, Controller, Post, Query } from '@nestjs/common';
import { AiClassService } from './ai-class.service';
import { CreateAiDto } from './dto/create-ai.dto';

@Controller('ai-classes')
export class AiClassController {
  constructor(private readonly svc: AiClassService) {}

  @Post()
  async create(@Body() dto: CreateAiDto, @Query('dryRun') dryRun?: 'true') {
    const generated = await this.svc.callOpenAI(dto);
    if (dryRun === 'true') return generated; // ⬅️  no insert
    return this.svc.saveMany(generated, dto); // as before
  }
}
