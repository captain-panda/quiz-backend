import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "../models";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }

  async addUser(username: string, hashedPassword: string): Promise<User> {
    try {
      return this.userModel.create({
        username: username,
        password: hashedPassword
      })
    } catch (err) {
      console.log(`UserRepository.addUser : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async findUser(username: string) {
    try {
      return this.userModel.findOne({
        username: username
      }).lean()
    } catch (err) {
      console.log(`UserRepository.findUser : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }

  async getUserByIds(ids: string[]) {
    try {
      const convertedIds = []
      ids.map((_id) => {
        if (Types.ObjectId.isValid(_id)) {
          convertedIds.push(new Types.ObjectId(_id))
        }
      })
      return this.userModel.find({
        _id: {
          $in: convertedIds
        }
      }).lean()
    } catch (err) {
      console.log(`UserRepository.findUser : Error - ${JSON.stringify(err)}`)
      throw err
    }
  }
}