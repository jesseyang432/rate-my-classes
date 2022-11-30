import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Course} from '../course/model';

/**
 * This file defines the properties stored in a Review
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reviews on the backend
export type Review = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    student: User,
    course: string, 
    term: string, 
    instructor: string,
    hours: number,
    knowledge: string,
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
    type: String,
    required: true
  },
  term: {
    type: String,
    required: false
  },
  instructor: {
    type: String,
    required: false
  },
  hours: {
    type: Number,
    required: false
  },
  knowledge: {
    type: String,
    required: false
  },
  grade: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: false
  },
  difficulty: {
    type: Number,
    required: false
  },
  overallRating: {
    type: Number,
    required: true
  },
  // The date the review was created
  dateCreated: {
    type: Date,
    required: true
  },
});

const ReviewModel = model<Review>('Review', ReviewSchema);
export default ReviewModel;
