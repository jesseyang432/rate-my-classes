import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Course, PopulatedCourse} from './model';

// Update this if you add a property to the Course type!
type CourseResponse = {
  _id: string;
  name: string;
  description: string;
};

/**
 * Transform a raw Course object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Course>} course - A course
 * @returns {CourseResponse} - The course object formatted for the frontend
 */
const constructCourseResponse = (course: HydratedDocument<Course>): CourseResponse => {
  const courseCopy: Course = {
    ...course.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...courseCopy,
    _id: courseCopy._id.toString()
  };
};

export {
  constructCourseResponse
};
