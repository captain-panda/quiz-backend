import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { QuizService } from './quiz.service';

@WebSocketGateway({
  namespace: 'quiz'
})
export class QuizGateway {
  @WebSocketServer()
  server: Server;

  constructor(private quizService: QuizService) { }

  @SubscribeMessage('quiz:init')
  async handleQuizInit(@MessageBody() body) {
    try {
      const quiz = await this.quizService.findQuizById(body.quizId);
      const question = await this.quizService.getQuestion(quiz.questions[0].questionId)
      const quizData = {
        player1: quiz.player1,
        player2: quiz.player2,
        question: {
          questionId: question._id.toString(),
          questionText: question.questionText,
          choices: question.choices,
          marks: question.marks
        }
      }
      this.server.to(quiz.player1.toString()).emit('quiz:init', quizData);
      this.server.to(quiz.player2.toString()).emit('quiz:init', quizData);
    } catch (err) {
      console.log(`QuizGateway.handleQuizInit : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  @SubscribeMessage('question:send')
  async handleQuestionSend(@MessageBody() body: { quizId: string, currentQuestionId: string }, @ConnectedSocket() client: Socket) {
    try {
      const quiz = await this.quizService.findQuizById(body.quizId);
      const currentQuestionIndex = quiz.questions.findIndex(q => q.questionId.toString() === body.currentQuestionId);

      if (currentQuestionIndex == quiz.questions.length - 1) {
        client.emit('question:last-question');
      } else {
        const nextQuestionId = quiz.questions[currentQuestionIndex + 1].questionId
        const question = await this.quizService.getQuestion(nextQuestionId)
        const questionData = {
          questionId: question._id.toString(),
          questionText: question.questionText,
          choices: question.choices,
          marks: question.marks
        }
        client.emit('question:send', questionData);
      }
    } catch (err) {
      console.log(`QuizGateway.handleQuestionSend : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  @SubscribeMessage('answer:submit')
  async handleAnswerSubmit(@MessageBody() body: { quizId: string, player: string, questionId: string, answer: string }) {
    try {
      await this.quizService.submitAnswer(body.quizId, body.player, body.questionId, body.answer);
    } catch (err) {
      console.log(`QuizGateway.handleAnswerSubmit : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  @SubscribeMessage('quiz:end')
  async handleQuizEnd(@MessageBody() body: { quizId: string }) {
    try {
      const quiz = await this.quizService.endQuiz(body.quizId);
      const quizResult = {
        player1: quiz.player1,
        player2: quiz.player2,
        ...quiz.result
      }

      this.server.to(quiz.player1.toString()).emit('quiz:end', quizResult);
      this.server.to(quiz.player2.toString()).emit('quiz:end', quizResult);
    } catch (err) {
      console.log(`QuizGateway.handleQuizEnd : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }
}
