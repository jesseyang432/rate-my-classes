import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReactionCollection from './collection';

/**
 * Checks if a Reaction with reactionId is req.params exists
 */
const isReactionExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reactionId);
  const Reaction = validFormat ? await ReactionCollection.findOne(req.params.reactionId) : '';
  if (!Reaction) {
    res.status(404).json({
      error: `Reaction with Reaction ID ${req.params.reactionId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the Reaction in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidReactionContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Reaction content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Reaction content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the Reaction whose reactionId is in req.params
 */
const isValidReactionModifier = async (req: Request, res: Response, next: NextFunction) => {
  const Reaction = await ReactionCollection.findOne(req.params.reactionId);
  const userId = Reaction.student._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

export {
  isValidReactionContent,
  isReactionExists,
  isValidReactionModifier
};
