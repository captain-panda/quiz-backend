import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Question } from "../models";

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<Question>
  ) { }

  async getQuestions() {
    try {
      return this.questionModel.find().limit(6)
    } catch (err) {
      console.log(`QuestionRepository.getQuestions : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async getQuestionsByIds(questionIds: Types.ObjectId[]): Promise<Question[]> {
    try {
      return this.questionModel.find({
        _id: { $in: questionIds }
      }).lean()
    } catch (err) {
      console.log(`QuestionRepository.getQuestionsByIds : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }
}