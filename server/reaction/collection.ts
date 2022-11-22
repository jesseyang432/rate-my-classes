import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction} from './model';
import ReactionModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Reaction> is the output of the FreetModel() constructor,
 * and contains all the information in Reaction. https://mongoosejs.com/docs/typescript.html
 */
class ReactionCollection {
  /**
   * Add a Reaction to the collection
   *
   * @param {string} student - The id of the author of the Reaction
   * @param {string} course - The id of the class of the Reaction
   * @param {string} content - The id of the content of the Reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly created Reaction
   */

  static async addOne(student: Types.ObjectId | string, course: string, content: string): Promise<HydratedDocument<Reaction>> {
    const date = new Date();
    const Reaction = new ReactionModel({
      student: student,
      course: course, 
      content: content,
      dateCreated: date,
    });
    await Reaction.save(); // Saves Reaction to MongoDB
    return Reaction.populate('student');
  }

  /**
   * Find a Reaction by reactionId
   *
   * @param {string} reactionId - The id of the Reaction to find
   * @return {Promise<HydratedDocument<Reaction>> | Promise<null> } - The Reaction with the given freetId, if any
   */
  static async findOne(reactionId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({_id: reactionId}).populate('student');
  }

  /**
   * Get all the reactions in the database
   *
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Reaction>>> {
    // Retrieves freets and sorts them from most to least recent
    return ReactionModel.find({}).sort({dateModified: -1}).populate('student');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Reaction>>> {
    const student = await UserCollection.findOneByUsername(username);
    return ReactionModel.find({student: student._id}).sort({dateModified: -1}).populate('student');
  }

  /**
   * Update a Reaction with the new content
   *
   * @param {string} freetId - The id of the Reaction to be updated
   * @param {string} content - The new content of the Reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly updated Reaction
   */
  static async updateOne(reactionId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Reaction>> {
    const Reaction = await ReactionModel.findOne({_id: reactionId});
    Reaction.content = content;
    await Reaction.save();
    return Reaction.populate('student');
  }

  /**
   * Delete a Reaction with given reactionId.
   *
   * @param {string} reactionId - The freetId of Reaction to delete
   * @return {Promise<Boolean>} - true if the Reaction has been deleted, false otherwise
   */
  static async deleteOne(reactionId: Types.ObjectId | string): Promise<boolean> {
    const Reaction = await ReactionModel.deleteOne({_id: reactionId});
    return Reaction !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(studentId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({studentId});
  }
}

export default ReactionCollection;