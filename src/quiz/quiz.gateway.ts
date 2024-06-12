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
  async handleQuizInit(@MessageBody() data: { quizId: string }) {
    try {
      const quiz = await this.quizService.findQuizById(data.quizId);
      this.server.to(quiz.player1.toString()).emit('quiz:init', quiz);
      this.server.to(quiz.player2.toString()).emit('quiz:init', quiz);
    } catch (err) {
      console.log(`QuizGateway.handleQuizInit : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  @SubscribeMessage('question:send')
  async handleQuestionSend(@MessageBody() data: { quizId: string, questionId: string }, @ConnectedSocket() client: Socket) {
    try {
      const quiz = await this.quizService.findQuizById(data.quizId);
      const question = quiz.questions.find(q => q.questionId.toString() === data.questionId);
      client.emit('question:send', question);
    } catch (err) {
      console.log(`QuizGateway.handleQuestionSend : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  @SubscribeMessage('answer:submit')
  async handleAnswerSubmit(@MessageBody() data: { quizId: string, player: string, questionId: string, answer: string }) {
    try {
      await this.quizService.submitAnswer(data.quizId, data.player, data.questionId, data.answer);
    } catch (err) {
      console.log(`QuizGateway.handleAnswerSubmit : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  @SubscribeMessage('quiz:end')
  async handleQuizEnd(@MessageBody() data: { quizId: string }) {
    const quiz = await this.quizService.endQuiz(data.quizId);
    this.server.to(quiz.player1.toString()).emit('quiz:end', quiz);
    this.server.to(quiz.player2.toString()).emit('quiz:end', quiz);
  }
}
