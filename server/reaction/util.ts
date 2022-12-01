import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reaction} from './model';

// Update this if you add a property to the Reaction type!
type ReactionResponse = {
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
const formatDate = (date: Date): string => moment(date).format('MMM DD');

/**
 * Transform a raw Reaction object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reaction>} Reaction - A Reaction
 * @returns {ReactionResponse} - The Reaction object formatted for the frontend
 */
const constructReactionResponse = (Reaction: HydratedDocument<Reaction>): ReactionResponse => {
  const reactionCopy: Reaction = {
    ...Reaction.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...reactionCopy,
    _id: reactionCopy._id.toString(),
    student: reactionCopy.student.username,
    course: reactionCopy.course,
    content: reactionCopy.content,
    dateCreated: formatDate(Reaction.dateCreated)
  };
};

export {
  constructReactionResponse
};
