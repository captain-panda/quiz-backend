import { Controller, Post, Body, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) { }

  @Post('start')
  async startquiz(@Body('player1') player1: string, @Body('player2') player2: string) {
    try {
      return this.quizService.startQuiz(player1, player2);
    } catch (err) {
      console.log(`QuizController.startquiz : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  @Post('end/:id')
  async endquiz(@Param('quizId') quizId: string) {
    try {
      return this.quizService.endQuiz(quizId);
    } catch (err) {
      console.log(`QuizController.endquiz : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }
}