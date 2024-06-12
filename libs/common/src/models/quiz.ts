import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class QuizQuestion {
  questionId: Types.ObjectId

  player1Answer?: string

  player2Answer?: string
}

export class Result {
  winner?: Types.ObjectId

  isDraw?: boolean
}

@Schema()
export class Quiz {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  player1: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  player2: Types.ObjectId;

  @Prop({ type: [QuizQuestion], required: true })
  questions: QuizQuestion[];

  @Prop({ type: Result, required: false })
  result?: Result;

  @Prop({ type: Boolean, default: true, required: false })
  isActive?: boolean
}

export type QuizDocument = Quiz & Document;

export const QuizSchema = SchemaFactory.createForClass(Quiz);