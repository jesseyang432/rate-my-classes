import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {SimilarityScore, PopulatedSimilarityScore} from '../similarity/model';
import type {User} from '../user/model';

// Update this if you add a property to the Similarity type!
type SimilarityScoreResponse = {
  _id: string;
  student1: User;
  student2: User;
  score: number,
};

/**
 * Transform a raw Enroll object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<SimilarityScore>} similarity - A similarity
 * @returns {SimilarityScoreResponse} - The similarity object formatted for the frontend
 */
const constructSimilarityScoreResponse = (similarity: HydratedDocument<SimilarityScore>): SimilarityScoreResponse => {
  const similarityCopy: PopulatedSimilarityScore = {
    ...similarity.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...similarityCopy,
    _id: similarityCopy._id.toString(),
  };
};

export {
  constructSimilarityScoreResponse
};
