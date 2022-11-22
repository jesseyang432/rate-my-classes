import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as reactionValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the reactions
 *
 * @name GET /api/reactions
 *
 * @return {ReactionResponse[]} - A list of all the reactions sorted in descending
 *                      order by date modified
 */
/**
 * Get reactions by student.
 *
 * @name GET /api/reactions?student=username
 *
 * @return {ReactionResponse[]} - An array of reactions created by user with username, student
 * @throws {400} - If student is not given
 * @throws {404} - If no user has given student
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if student query parameter was supplied
    if (req.query.student !== undefined) {
      next();
      return;
    }

    const allReactions = await ReactionCollection.findAll();
    const response = allReactions.map(util.constructReactionResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const studentReactions = await ReactionCollection.findAllByUsername(req.query.student as string);
    const response = studentReactions.map(util.constructReactionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Reaction.
 *
 * @name POST /api/reactions
 *
 * @param {string} content - The content of the Reaction
 * @return {ReactionResponse} - The created Reaction
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the Reaction content is empty or a stream of empty spaces
 * @throws {413} - If the Reaction content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    reactionValidator.isValidReactionContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const Reaction = await ReactionCollection.addOne(userId, req.body.course, req.body.content);

    res.status(201).json({
      message: 'Your Reaction was created successfully.',
      Reaction: util.constructReactionResponse(Reaction)
    });
  }
);

/**
 * Delete a Reaction
 *
 * @name DELETE /api/reactions/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the student of
 *                 the Reaction
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:reactionId?',
  [
    userValidator.isUserLoggedIn,
    reactionValidator.isReactionExists,
    reactionValidator.isValidReactionModifier
  ],
  async (req: Request, res: Response) => {
    await ReactionCollection.deleteOne(req.params.reactionId);
    res.status(200).json({
      message: 'Your Reaction was deleted successfully.'
    });
  }
);

/**
 * Modify a Reaction
 *
 * @name PATCH /api/reactions/:id
 *
 * @param {string} content - the new content for the Reaction
 * @return {ReactionResponse} - the updated Reaction
 * @throws {403} - if the user is not logged in or not the student of
 *                 of the Reaction
 * @throws {404} - If the reactionId is not valid
 * @throws {400} - If the Reaction content is empty or a stream of empty spaces
 * @throws {413} - If the Reaction content is more than 140 characters long
 */
router.patch(
  '/:reactionId?',
  [
    userValidator.isUserLoggedIn,
    reactionValidator.isReactionExists,
    reactionValidator.isValidReactionModifier,
    reactionValidator.isValidReactionContent
  ],
  async (req: Request, res: Response) => {
    const Reaction = await ReactionCollection.updateOne(req.params.reactionId,req.body.content);
    res.status(200).json({
      message: 'Your Reaction was updated successfully.',
      Reaction: util.constructReactionResponse(Reaction)
    });
  }
);

export {router as reactionRouter};
