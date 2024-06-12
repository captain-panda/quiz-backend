import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Quiz } from "../models";

@Injectable()
export class QuizRepository {
  constructor(
    @InjectModel(Quiz.name)
    private readonly quizModel: Model<Quiz>
  ) { }

  async getQuizById(quizId: string): Promise<Quiz> {
    try {
      return this.quizModel.findOne({
        _id: new Types.ObjectId(quizId)
      }).lean()
    } catch (err) {
      console.log(`QuizRepository.getQuizById : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async createQuiz(quizDoc: Quiz): Promise<Quiz> {
    try {
      return this.quizModel.create(quizDoc)
    } catch (err) {
      console.log(`QuizRepository.createQuiz : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async submitAnswer(quizId: string, playerId: string, questionId: string, answer: string) {
    try {
      const quiz = await this.quizModel.findById(new Types.ObjectId(quizId)).lean()
      if (quiz.player1.toString() == playerId) {
        return this.quizModel.updateOne({
          _id: new Types.ObjectId(quizId),
          "questions.questionId": new Types.ObjectId(questionId)
        }, {
          $set: {
            "questions.$.player1Answer": answer
          }
        }).lean()
      } else if (quiz.player2.toString() == playerId) {
        return this.quizModel.updateOne({
          _id: new Types.ObjectId(quizId),
          "questions.questionId": new Types.ObjectId(questionId)
        }, {
          $set: {
            "questions.$.player2Answer": answer
          }
        }).lean()
      }
    } catch (err) {
      console.log(`QuizRepository.submitAnswer : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async endQuiz(quizId: Types.ObjectId, winner?: Types.ObjectId): Promise<Quiz> {
    try {
      if (winner == undefined) {
        await this.quizModel.updateOne({
          _id: quizId
        }, {
          $set: {
            isActive: false,
            "result.isDraw": true
          }
        }).lean()
      } else {
        await this.quizModel.updateOne({
          _id: quizId
        }, {
          $set: {
            isActive: false,
            "result.isDraw": false,
            "result.winner": winner,
          }
        }).lean()
      }
      return this.quizModel.findOne({ _id: quizId }).lean()
    } catch (err) {
      console.log(`QuizRepository.endQuiz : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }
}