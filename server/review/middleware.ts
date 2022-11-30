import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReviewCollection from './collection';

/**
 * Checks if a Review with reviewId is req.params exists
 */
const isReviewExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reviewId);
  const review = validFormat ? await ReviewCollection.findOne(req.params.reviewId) : '';
  if (!review) {
    res.status(404).json({
      error: `Review with Review ID ${req.params.reviewId} does not exist.`
    });
    return;
  }

  next();
};

//TODO: isWrittenReviewBefore

/**
 * Checks if the content of the Review in req.body is valid, i.e not a stream of empty
 * spaces and not more than 400 characters
 * Other checks should be enforced by the frontend submitting the form
 */
const isValidReviewContent = (req: Request, res: Response, next: NextFunction) => {
  const content = req.body.content;

  if (content.length > 400) {
    res.status(413).json({
      error: 'Review content must be no more than 400 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Review whose reviewId is in req.params
 */
const isValidReviewModifier = async (req: Request, res: Response, next: NextFunction) => {
  const review = await ReviewCollection.findOne(req.params.reviewId);
  const userId = review.student._id;
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
