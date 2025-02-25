import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizGateway } from './quiz.gateway';
import { QuizController } from './quiz.controller';
import { Question, QuestionRepository, QuestionSchema, Quiz, QuizRepository, QuizSchema, User, UserRepository, UserSchema } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [QuizController],
  providers: [
    QuizService,
    QuizGateway,
    QuestionRepository,
    QuizRepository,
    UserRepository,
  ],
})
export class QuizModule { }
