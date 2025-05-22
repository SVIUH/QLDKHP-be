import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Provider } from '@nestjs/common';

export const AI_CLASS_PROMPT = 'AI_CLASS_PROMPT';

export const AiPromptProvider: Provider = {
  provide: AI_CLASS_PROMPT,
  useFactory: () => {
    // Try multiple possible locations
    const possiblePaths = [
      // Production path (after build)
      join(process.cwd(), 'dist', 'prompts', 'class-scheduler.txt'),
      // Development path
      join(process.cwd(), 'src', 'prompts', 'class-scheduler.txt'),
      // Alternative path
      join(__dirname, '..', 'prompts', 'class-scheduler.txt'),
    ];

    // Find the first existing path
    const filePath = possiblePaths.find((path) => existsSync(path));

    if (!filePath) {
      throw new Error(
        `Prompt file not found. Tried locations:\n${possiblePaths.join('\n')}`,
      );
    }

    return readFileSync(filePath, 'utf8');
  },
};
