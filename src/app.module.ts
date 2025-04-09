import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubjectModule } from './subject/subject.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SubjectModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}