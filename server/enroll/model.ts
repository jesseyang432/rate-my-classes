import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Enroll = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  fromStudent: Types.ObjectId;
  toClass: Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const EnrollSchema = new Schema<Enroll>({
  // The author userId
  fromStudent: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
  },
  // The date the freet was created
  toClass: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

const EnrolledModel = model<Enroll>('Enroll', EnrollSchema);
export default EnrolledModel;
