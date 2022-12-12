import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import ReactionModel from '../reaction/model';

import type {User} from '../user/model'; 
import UserCollection from '../user/collection';
import ReactionCollection from '../reaction/collection';
import UserModel from '../user/model';

/**
  * findOne: by likeId
  * findOneByPostAndUserId
  * findAll
  * addOne
  * deleteOne: by likeId
  * deleteMany: unlikes all of the likes by a user
  * findAllByFreet: gets all of the likes for a reaction
  * findAllByUser: gets all the likes that the user has liked
  * findAllLikesRecieved: gets all the likes that the user has recieved
  * 
*/


class LikeCollection {
  /**
   * Find a like by likeId
   *
   * @param {string} likeId - The id of the reaction to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The reaction with the given reactionId, if any
   */
  static async findOne(likeId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({_id: likeId}).populate(['post', 'userPost', 'userLike']); //TODO: how this work
  }

  /**
   * Find a like by post and userLike
   *
   * @param {string} likeId - The id of the reaction to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The reaction with the given reactionId, if any
   */
   static async findOneByPostAndUserId(postId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const post = await ReactionCollection.findOne(postId);
    const userLike = await UserCollection.findOneByUserId(userId);
    return LikeModel.findOne({post: post, userLike: userLike}).populate(['post', 'userPost', 'userLike']); //TODO: how this work
  }

  /**
   * Get all the likes in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the reactions
   */
   static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves reactions and sorts them from most to least recent
    return LikeModel.find({}).sort({dateModified: -1}).populate(['post', 'userPost', 'userLike']);
  }

  /**
   * Like a user's post
   *
   * @param {string} reactionId - the reaction being liked
   * @param {string} userId - The user liking the post
   * @return {Promise<HydratedDocument<Like>>} - The new follow
   */
  
  static async addOne(reactionId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const dateLiked = new Date();
    const reactionObject = await ReactionCollection.findOne(reactionId);
    const userPost = reactionObject.student;
    const userLike = await UserCollection.findOneByUserId(userId);
    const like = new LikeModel({post: reactionObject, userPost: userPost, userLike: userLike, dateLiked: dateLiked});
    await like.save(); // Saves user to MongoDB

    //synchronization: update the post
    const likePost = ReactionCollection.addLike(reactionId);

    return like.populate(['post', 'userPost','userLike']); //TODO: help understanding this
  }

  /**
   * Unlike a user's post
   *
   * @param {string} likeId - The id of like to delete
   * @return {Promise<Boolean>} - true if the reaction has been deleted, false otherwise
   */

  static async deleteOne(likeId: Types.ObjectId | string): Promise<boolean> {
    //synchronization: increment the post
    const like = await LikeModel.findOne({_id: likeId});
    const likePost = await ReactionCollection.deleteLike(like.post._id);

    const deleteLike = await LikeModel.deleteOne({_id: likeId});

    return like !== null;
  }

  /**
   * Delete's all the likes from that user
   *
   * @param {string} userId - delete all the likes from this user
   * @return {Promise<Boolean>} - true if the reaction has been deleted, false otherwise
   */

   static async deleteMany(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserCollection.findOneByUserId(userId);
    const like = await LikeModel.deleteMany({userPost: userId});
    return like !== null;
  }

  static async deleteByReaction(reactionId: Types.ObjectId | string): Promise<boolean> {
    const reaction = await ReactionCollection.findOne(reactionId);
    const like = await LikeModel.deleteMany({post: reaction._id});
    return like !== null;
  }

  /**
   * Get all the likes for a reaction 
   *
   * @param {string} reactionId
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the reactions
   */
   static async findAllByFreet(reactionId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    const post = await ReactionCollection.findOne(reactionId);
    return LikeModel.find({post: post}).populate(['post', 'userPost','userLike']); //TODO: is this the right populate
  }

  /**
   * Get all the posts that a user has liked
   *
   * @param {string} userId
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the reactions
   */
   static async findAllByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    const user = await UserCollection.findOneByUserId(userId);
    return LikeModel.find({userLike: user}).populate(['post, userPost,userLike']); 
  }

  /**
   * Get all the likes that the user has recieved
   *
   * @param {string} userId
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the reactions
   */
   static async findAllLikesRecieved(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    const user = await UserCollection.findOneByUserId(userId);
    const reactions = await ReactionCollection.findAllByUsername(user.username);
    return LikeModel.find({userPost: reactions}).populate(['post', 'userPost','userLike']); //TODO: check if this is right
  }

}

export default LikeCollection;
