import type {HydratedDocument, Types} from 'mongoose';
import type {Review} from './model';
import ReviewModel from './model';
import UserCollection from '../user/collection';
import CourseCollection from '../course/collection';

/**
 * This files contains a class that has the functionality to explore reviews
 * stored in MongoDB, including adding, finding, updating, and deleting reviews.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Review> is the output of the FreetModel() constructor,
 * and contains all the information in Review. https://mongoosejs.com/docs/typescript.html
 */
class ReviewCollection {
  /**
   * Add a Review to the collection
   *
   * @param {string} student - The id of the author of the Review
   * @param {string} course - The name of the class of the Review
   * @param {string} content - The id of the content of the Review
   * @return {Promise<HydratedDocument<Review>>} - The newly created Review
   */

  static async addOne(student: Types.ObjectId | string, 
    course: string,  
    term: string, 
    instructor: string,
    hours: number,
    knowledge: string,
    grade: string,
    content: string,
    difficulty: number,
    overallRating: number,
    ): Promise<HydratedDocument<Review>> {
    const date = new Date();
    const Review = new ReviewModel({
      student: student,
      course: course, 
      term: term,
      instructor: instructor,
      hours: hours, 
      knowledge: knowledge, 
      grade: grade, 
      content: content, 
      difficulty: difficulty, 
      overallRating: overallRating, 
      dateCreated: date,
    });
    await Review.save(); // Saves Review to MongoDB
    return Review.populate('student');
  }

  /**
   * Find a Review by reviewId
   *
   * @param {string} reviewId - The id of the Review to find
   * @return {Promise<HydratedDocument<Review>> | Promise<null> } - The Review with the given freetId, if any
   */
  static async findOne(reviewId: Types.ObjectId | string): Promise<HydratedDocument<Review>> {
    return ReviewModel.findOne({_id: reviewId}).populate('student');
  }

  /**
   * Get all the reviews in the database
   *
   * @return {Promise<HydratedDocument<Review>[]>} - An array of all of the reviews
   */
  static async findAll(): Promise<Array<HydratedDocument<Review>>> {
    // Retrieves reviews and sorts them from most to least recent
    return ReviewModel.find({}).sort({dateModified: -1}).populate('student');
  }

  /**
   * Get all the reviews written by a given username
   *
   * @param {string} username - The username of author of the reviews
   * @return {Promise<HydratedDocument<Review>[]>} - An array of all of the reviews
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Review>>> {
    const student = await UserCollection.findOneByUsername(username);
    return ReviewModel.find({student: student._id}).sort({dateModified: -1}).populate('student');
  }

  /**
   * Get the reviews for a given course 
   *
   * @param {string} courseName - The name of the course
   * @return {Promise<HydratedDocument<Review>[]>} - An array of all of the reviews
   */
   static async findAllByCourse(courseName: string): Promise<Array<HydratedDocument<Review>>> {
    // const course = await CourseCollection.findOneByName(courseName);
    return ReviewModel.find({course: courseName}).sort({dateModified: -1}).populate('student');
  }


  /**
   * Update a Review with the new content
   *
   * @param {string} reviewId - The id of the Review to be updated
   * @param {string} content - The new content of the Review
   * @return {Promise<HydratedDocument<Review>>} - The newly updated Review
   */
  static async updateOne(reviewId: Types.ObjectId | string, 
    term: string, 
    instructor: string,
    hours: number,
    knowledge: string,
    grade: string,
    content: string,
    difficulty: number,
    overallRating: number): Promise<HydratedDocument<Review>> {
    const review = await ReviewModel.findOne({_id: reviewId});
    review.term = term;
    review.instructor = instructor;
    review.hours = hours;
    review.knowledge = knowledge;
    review.grade = grade;
    review.content = content;
    review.difficulty = difficulty;
    review.overallRating = overallRating;
    await review.save();
    return review.populate('student');
  }

  /**
   * Delete a Review with given reviewId.
   *
   * @param {string} reviewId - The freetId of Review to delete
   * @return {Promise<Boolean>} - true if the Review has been deleted, false otherwise
   */
  static async deleteOne(reviewId: Types.ObjectId | string): Promise<boolean> {
    const review = await ReviewModel.deleteOne({_id: reviewId});
    return review !== null;
  }

  /**
   * Delete all the reviews by the given author
   *
   * @param {string} authorId - The id of author of reviews
   */
  static async deleteMany(studentId: Types.ObjectId | string): Promise<void> {
    await ReviewModel.deleteMany({student: studentId});
  }

}

export default ReviewCollection;
