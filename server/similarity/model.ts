import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Course} from '../course/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Enroll on the backend
export type SimilarityScore = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  student1: String;
  student2: String;
  score: Number;
};

export type PopulatedSimilarityScore = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  student1: User;
  student2: User;
  score: Number;
}

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SimilarityScoreSchema = new Schema<SimilarityScore>({
  // The author userId
  student1: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  student2: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  score: {
    type: Number,
    required: true,
  }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

const SimilarityScoreModel = model<SimilarityScore>('SimilarityScore', SimilarityScoreSchema);
export default SimilarityScoreModel;
