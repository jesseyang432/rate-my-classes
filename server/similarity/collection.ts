import type {HydratedDocument, Types} from 'mongoose';
import type {SimilarityScore, PopulatedSimilarityScore} from './model';
import SimilarityScoreModel from './model';
import UserCollection from '../user/collection';
import EnrollCollection from '../enroll/collection'; 
import ReviewCollection from '../review/collection';

class SimilarityScoreCollection {
    // find similarity score between current user and everyone else
    static async find(student: Types.ObjectId | string): Promise<Array<HydratedDocument<SimilarityScore>>> {
        const scores1 = await SimilarityScoreModel.find({student1: student}).populate('student1 student2');
        const scores2 = await SimilarityScoreModel.find({student2: student}).populate('student1 student2');
        const scores = scores1.concat(scores2); 
        return scores;
    }

    // create new pairings for a new user 
    static async newPairings(student: Types.ObjectId | string): Promise<boolean> {
        const allUsers = UserCollection.findAll(); 
        (await allUsers).forEach( async user => {
            if (user._id.toString() !== student.toString()) {
                const exists1 = await SimilarityScoreModel.findOne({student1: student, student2: user._id});
                if (!exists1) {
                    const SimScore1 = new SimilarityScoreModel({
                    student1: student,
                    student2: user._id,
                    score: 50 // TODO: Calculate Score                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                    });
                    await SimScore1.save();
                }   

                const exists2 = await SimilarityScoreModel.findOne({student1: user._id, student2: student});
                if (!exists2) {
                    const SimScore2 = new SimilarityScoreModel({
                    student1: user._id,
                    student2: student,
                    score: 50 // TODO: Calculate Score                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                    });
                    await SimScore2.save();
                }
            }
        });
        return true; 
    }

    // delete old pairings when delete user
    static async deletePairings(student: Types.ObjectId | string): Promise<Boolean> {
        const obsoletePairings1 = await SimilarityScoreModel.deleteMany({ student1: student });
        const obsoletePairings2 = await SimilarityScoreModel.deleteMany({ student2: student });
        return (obsoletePairings1 && obsoletePairings2) !== null;
    }

    // update pairings or creates new pairings if they don't already exist
    static async updatePairings(student: Types.ObjectId | string): Promise<Boolean> {
        const allUsers = UserCollection.findAll(); 
        (await allUsers).forEach( async user => {
            if (user._id.toString() !== student.toString()) {
                const exists1 = await SimilarityScoreModel.findOne({student1: student, student2: user._id});
                const score1 = await this.calculateScore(student, user._id);
                if (!exists1) {
                    const SimScore1 = new SimilarityScoreModel({
                    student1: student,
                    student2: user._id,
                    score: score1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                    });
                    await SimScore1.save();
                } else {
                    exists1.score = score1;
                    await exists1.save();
                }  

                const exists2 = await SimilarityScoreModel.findOne({student1: user._id, student2: student});
                const score2 = await this.calculateScore(user._id, student);
                if (!exists2) {
                    const SimScore2 = new SimilarityScoreModel({
                    student1: user._id,
                    student2: student,
                    score: score2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                    });
                    await SimScore2.save();
                } else {
                    exists2.score = score2
                    await exists2.save();
                }
            }
        });
        return true; 
      }
    
    // calculate similarity score between 2 users. Asymmetric based on shared courses and past ratings
    static async calculateScore(student1: Types.ObjectId | string, student2: Types.ObjectId | string): Promise<number> {
        const courses1 = (await EnrollCollection.findAllbyStudent(student1)).map((enrollment) => enrollment.toCourse._id.toString());
        const courses2 = (await EnrollCollection.findAllbyStudent(student2)).map((enrollment) => enrollment.toCourse._id.toString());
        const commonCourses = courses1.filter(course => courses2.includes(course));
        const reviews1 = (await ReviewCollection.findAllByStudent(student1));
        const reviews2 = (await ReviewCollection.findAllByStudent(student2));
        const courseToRating1 = new Map(
            reviews1.map(review => {
                return [review.course, review.overallRating];
            }),
        );
        const courseToRating2 = new Map(
            reviews2.map(review => {
                return [review.course, review.overallRating];
            }),
        );
        let commonlyRated = 0;
        let totalSimilarlyRated = 0;
        for (const [course, val1] of courseToRating1.entries()) {
            if (courseToRating2.has(course)) {
                const val2 = courseToRating2.get(course);
                commonlyRated += 1;
                if (val2 - 1 <= val1 && val1 <= val2 + 1) {
                    totalSimilarlyRated += 1;
                }
            }
        }
        let similarityScore = 100 * (commonCourses.length/(courses1.length + 1));
        similarityScore = (similarityScore + 100 * (totalSimilarlyRated / (commonlyRated + 1))) / 2; // weight with common ratings
        similarityScore = 50 + 50 * (similarityScore / 100); 
        return similarityScore; 
    }
     

}
export default SimilarityScoreCollection;