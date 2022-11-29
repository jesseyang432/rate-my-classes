import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Enroll, PopulatedEnroll} from '../enroll/model';
import type {User} from '../user/model';
import type {Course} from '../course/model';

// Update this if you add a property to the Enroll type!
type EnrollResponse = {
  _id: string;
  fromStudent: User;
  toCourse: Course;
  type: string,
};

/**
 * Transform a raw Enroll object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Enroll>} enroll - An enrollment
 * @returns {EnrollResponse} - The enroll object formatted for the frontend
 */
const constructEnrollResponse = (enroll: HydratedDocument<Enroll>): EnrollResponse => {
  const enrollCopy: PopulatedEnroll = {
    ...enroll.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...enrollCopy,
    _id: enrollCopy._id.toString(),
  };
};

export {
  constructEnrollResponse
};
