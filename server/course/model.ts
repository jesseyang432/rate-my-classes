import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Course
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Course on the backend
export type Course = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  description: string;
};

export type PopulatedCourse = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  description: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Courses stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CourseSchema = new Schema<Course>({
  // The name of the class
  name: {
    type: String,
    required: true,
  },
  // The description of the class
  description: {
    type: String,
    required: true,
  }
});

const CourseModel = model<Course>('Course', CourseSchema);
export default CourseModel;
