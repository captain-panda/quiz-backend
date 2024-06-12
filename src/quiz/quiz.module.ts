import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizGateway } from './quiz.gateway';
import { QuizController } from './quiz.controller';
import { QuestionRepository, QuizRepository } from '@app/common';

@Module({
  controllers: [QuizController],
  providers: [
    QuizService,
    QuizGateway,
    QuestionRepository,
    QuizRepository
  ],
})
export class QuizModule { }
