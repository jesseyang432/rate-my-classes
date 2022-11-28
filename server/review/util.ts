import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Review} from './model';

// Update this if you add a property to the Review type!
type ReviewResponse = {
  _id: string;
  student: string;
  course: string;
  content: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Review object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Review>} Review - A Review
 * @returns {ReviewResponse} - The Review object formatted for the frontend
 */
const constructReviewResponse = (Review: HydratedDocument<Review>): ReviewResponse => {
  const reactionCopy: Review = {
    ...Review.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...reactionCopy,
    _id: reactionCopy._id.toString(),
    student: reactionCopy.student.username,
    course: reactionCopy.course,
    content: reactionCopy.content,
    dateCreated: formatDate(Review.dateCreated)
  };
};

export {
  constructReviewResponse
};
