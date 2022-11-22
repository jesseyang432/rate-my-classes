import type {HydratedDocument, Types} from 'mongoose';
import type {Course} from './model';
import CourseModel from './model';

/**
 * This files contains a class that has the functionality to explore courses
 * stored in MongoDB, including adding, finding, updating, and deleting courses.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Course> is the output of the CourseModel() constructor,
 * and contains all the information in Course. https://mongoosejs.com/docs/typescript.html
 */
class CourseCollection {
  /**
   * Get all the courses in the database
   *
   * @return {Promise<HydratedDocument<Course>[]>} - An array of all of the courses
   */
  static async findAll(): Promise<Array<HydratedDocument<Course>>> {
    // Retrieves courses and sorts them alphabetically
    return CourseModel.find({}).sort({name: 1});
  }

  static async findOne(name: string): Promise<HydratedDocument<Course>> {
    return CourseModel.findOne({ name: name });
  }
}

export default CourseCollection;
