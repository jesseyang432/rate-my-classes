import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Review} from './model';
import type {User} from '../user/model';
import type {Course} from '../course/model';

// Update this if you add a property to the Review type!
type ReviewResponse = {
  _id: string; // MongoDB assigns each object this ID on creation
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
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY');

/**
 * Transform a raw Review object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Review>} review - A review
 * @returns {ReviewResponse} - The Review object formatted for the frontend
 */
const constructReviewResponse = (review: HydratedDocument<Review>): ReviewResponse => {
  const reviewCopy: Review = {
    ...review.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...reviewCopy,
    _id: reviewCopy._id.toString(),
    dateCreated: formatDate(review.dateCreated)
  };
};

export {
  constructReviewResponse
};
