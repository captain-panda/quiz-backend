import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [AuthModule, QuizModule],
})
export class AppModule { }
