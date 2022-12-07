import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Reaction
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reactions on the backend
export type Reaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  student: User;
  content: string;
  course: string;
  dateCreated: Date;
  numLikes: number; 
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reactions stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReactionSchema = new Schema<Reaction>({
  // The author userId
  student: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  // The date the reaction was created
  dateCreated: {
    type: Date,
    required: true
  },
  numLikes: {
    type: Number,
    required: true
  },
});

const ReactionModel = model<Reaction>('Reaction', ReactionSchema);
export default ReactionModel;
