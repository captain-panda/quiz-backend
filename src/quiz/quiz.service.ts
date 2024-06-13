import { Question, QuestionRepository, Quiz, QuizRepository, UserRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository
  ) { }

  async startQuiz(player1Id: string, player2Id: string): Promise<Quiz> {
    try {
      const players = await this.userRepository.getUserByIds([player1Id, player2Id])
      if (players.length < 2) {
        return null
      }
      const questions = await this.questionRepository.getQuestions()
      const quizDoc = {
        player1: new Types.ObjectId(player1Id),
        player2: new Types.ObjectId(player2Id),
        questions: questions.map((question) => {
          return { questionId: question._id }
        })
      }
      return this.quizRepository.createQuiz(quizDoc)
    } catch (err) {
      console.log(`QuizService.startQuiz : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async submitAnswer(quizId: string, playerId: string, questionId: string, answer: string): Promise<void> {
    try {
      await this.quizRepository.submitAnswer(quizId, playerId, questionId, answer);
    } catch (err) {
      console.log(`QuizService.submitAnswer : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async endQuiz(quizId: string): Promise<Quiz> {
    try {
      const quiz = await this.quizRepository.getQuizById(quizId);
      if (!quiz) return null
      const questions = await this.questionRepository.getQuestionsByIds(quiz.questions.map((question) => question.questionId))
      let player1Score = 0, player2Score = 0

      for (const question of quiz.questions) {
        const questionData = questions.find((_q) => _q._id.toString() == question.questionId.toString())

        if (question.player1Answer && questionData.correctAnswer == question.player1Answer) player1Score += questionData.marks
        if (question.player2Answer && questionData.correctAnswer == question.player2Answer) player2Score += questionData.marks
      }

      if (player1Score > player2Score) {
        return this.quizRepository.endQuiz(quiz._id, quiz.player1)
      } else if (player1Score < player2Score) {
        return this.quizRepository.endQuiz(quiz._id, quiz.player2)
      }
      return this.quizRepository.endQuiz(quiz._id)

    } catch (err) {
      console.log(`QuizService.submitAnswer : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async findQuizById(quizId: string) {
    try {
      return this.quizRepository.getQuizById(quizId)
    } catch (err) {
      console.log(`QuizService.findQuizById : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async getQuestion(questionId: Types.ObjectId): Promise<Question> {
    try {
      const question = await this.questionRepository.getQuestionsByIds([questionId])
      return question[0]
    } catch (err) {
      console.log(`QuizService.getQuestion : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }
}
