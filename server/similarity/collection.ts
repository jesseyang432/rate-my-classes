import type {HydratedDocument, Types} from 'mongoose';
import type {SimilarityScore, PopulatedSimilarityScore} from './model';
import SimilarityScoreModel from './model';
import UserCollection from '../user/collection';
import EnrollCollection from '../enroll/collection'; 

class SimilarityScoreCollection {
    // find similarity score between current user and everyone else
    static async find(student: Types.ObjectId | string ): Promise<Array<HydratedDocument<SimilarityScore>>> {
        const scores1 = await SimilarityScoreModel.find({student1: student});
        const scores2 = await SimilarityScoreModel.find({student2: student});
        const scores = scores1.concat(scores2); 
        return scores;
    }

    // create new pairings for a new user 
    static async newPairings(student: Types.ObjectId | string ): Promise<boolean> {
        const allUsers = UserCollection.findAll(); 
        (await allUsers).forEach( user => {
            const SimScore1 = new SimilarityScoreModel({
            student1: student,
            student2: user,
            score: 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            });
            SimScore1.save();
            SimScore1.populate('student1, student2, score')

            const SimScore2 = new SimilarityScoreModel({
            student1: user,
            student2: student,
            score: 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            });
            SimScore2.save();
            SimScore2.populate('student1, student2, score')
        });
        return true; 
    }

    // delete old pairings when delete user
    static async deletePairings(student: Types.ObjectId | string): Promise<Boolean> {
        const obsoletePairings1 = await SimilarityScoreModel.deleteMany({ student1: student });
        const obsoletePairings2 = await SimilarityScoreModel.deleteMany({ student2: student });
        return (obsoletePairings1 && obsoletePairings2) !== null;
    }

    // update pairings when student's enrollment changes 
    static async updatePairings(student: Types.ObjectId | string ): Promise<Boolean> {
        const pairings = await SimilarityScoreCollection.find(student);
        (await pairings).forEach( pair => {
            pair.score = 0;
            pair.save();
            pair.populate('score');
        });
        return true; 
      }
    
    // calculate similarity score between 2 users. Currently simplified and asymmetric 
    static async calculateScore(student1: Types.ObjectId | string, student2: Types.ObjectId | string): Promise<Number> {
        const courses1 = Array(EnrollCollection.findAllbyStudent(student1)); 
        const courses2 = Array(EnrollCollection.findAllbyStudent(student2)); 
        const commonCourses = courses1.filter(course => courses2.includes(course));
        const score = 100*(commonCourses.length/courses1.length); 
        return score; 
    }
     

}
export default SimilarityScoreCollection;