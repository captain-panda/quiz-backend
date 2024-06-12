import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'questions' })
export class Question {
  _id: Types.ObjectId;

  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true })
  choices: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true })
  marks: number
}

export type QuestionDocument = Question & Document;

export const QuestionSchema = SchemaFactory.createForClass(Question);