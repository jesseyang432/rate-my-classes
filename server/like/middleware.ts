import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import ReactionCollection from '../reaction/collection';
import LikeCollection from './collection';

/**
 * Checks that the post you're trying to like exists, by postId
 */
 const isPostExist = async (req: Request, res: Response, next: NextFunction) => {
  const reaction = await ReactionCollection.findOne(req.body.postId);
  if (!reaction) {
    res.status(404).json({
      error: `Reaction with post ID ${req.body.postId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks that you are not liking your own post
 */
 const isPostNotSelf = async (req: Request, res: Response, next: NextFunction) => {
  const post = await ReactionCollection.findOne(req.body.postId);
  if (req.session.userId == post.student._id) {
    res.status(405).json({
      error: `You cannot like your own post, silly!`
    });
    return;
  }
  next();
};

/**
 * Checks that you liked the post
 */
 const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = await UserCollection.findOneByUserId(req.session.userId);
  const post = await ReactionCollection.findOne(req.body.postId);
  const like = await LikeCollection.findOneByPostAndUserId(post._id, currentUser._id); 
  if (!like) {
    res.status(406).json({
      error: `This post wasn't liked. You can't unlike the post.`
    });
    return;
  }
  next();
};

/**
 * Checks that you haven't already liked the post
 */
 const isLikeNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = await UserCollection.findOneByUserId(req.session.userId);
  const post = await ReactionCollection.findOne(req.body.postId);
  const like = await LikeCollection.findOneByPostAndUserId(post._id, currentUser._id); 
  // console.log(like);
  if (like) {
    res.status(402).json({
      error: `You already liked this post. You cannot like it again.`
    });
    return;
  }
  next();
};

export {
  isPostExist,
  isPostNotSelf, //cannot like your own posts
  isLikeExists,
  isLikeNotExists,
};
