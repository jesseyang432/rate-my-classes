import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Reaction
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reactions on the backend
export type Review = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    student: User,
    course: string, 
    term: string, 
    instructor: string,
    hours: number,
    knowledge: number,
    grade: string,
    content: string,
    difficulty: number,
    overallRating: number,
    dateCreated: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reactions stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReviewSchema = new Schema<Review>({
  // The author userId
  student: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  course: {
    type: Schema.Types.String,
    required: true
  },
  term: {
    type: Schema.Types.String,
    required: true
  },
  instructor: {
    type: Schema.Types.String,
    required: true
  },
  hours: {
    type: Schema.Types.Number,
    required: true
  },
  knowledge: {
    type: Schema.Types.Number,
    required: true
  },
  grade: {
    type: Schema.Types.String,
    required: true
  },
  content: {
    type: Schema.Types.String,
    required: true
  },
  difficulty: {
    type: Schema.Types.Number,
    required: true
  },
  overallRating: {
    type: Schema.Types.Number,
    required: true
  },
  // The date the reaction was created
  dateCreated: {
    type: Date,
    required: true
  },
});

const ReviewModel = model<Review>('Review', ReviewSchema);
export default ReviewModel;
