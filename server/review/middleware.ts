import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReviewCollection from './collection';

/**
 * Checks if a Review with reactionId is req.params exists
 */
const isReviewExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reactionId);
  const Review = validFormat ? await ReviewCollection.findOne(req.params.reactionId) : '';
  if (!Review) {
    res.status(404).json({
      error: `Review with Review ID ${req.params.reactionId} does not exist.`
    });
    return;
  }

  next();
};

//TODO: isWrittenReviewBefore

/**
 * Checks if the content of the Review in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidReviewContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Review content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Review content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Review whose reactionId is in req.params
 */
const isValidReviewModifier = async (req: Request, res: Response, next: NextFunction) => {
  const Review = await ReviewCollection.findOne(req.params.reactionId);
  const userId = Review.student._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' reactions.'
    });
    return;
  }

  next();
};

export {
  isValidReviewContent,
  isReviewExists,
  isValidReviewModifier
};
