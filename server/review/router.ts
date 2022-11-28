import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReviewCollection from './collection';
import * as userValidator from '../user/middleware';
import * as courseValidator from '../course/middleware';
import * as reviewValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the reviews
 *
 * @name GET /api/reviews
 *
 * @return {ReviewResponse[]} - A list of all the reviews sorted in descending
 *                      order by date modified
 */
/**
 * Get reviews by course.
 *
 * @name GET /api/reviews?student=username
 *
 * @return {ReviewResponse[]} - An array of reviews created for a course
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

    const allReactions = await ReviewCollection.findAll();
    const response = allReactions.map(util.constructReviewResponse);
    res.status(200).json(response);
  },
  [
    courseValidator.isCourseExists, 
  ],
  async (req: Request, res: Response) => {
    const courseReviews = await ReviewCollection.findAllByCourse(req.query.course as string);
    const response = courseReviews.map(util.constructReviewResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Review.
 *
 * @name POST /api/reviews
 *
 * @param {string} content - The content of the Review
 * @return {ReviewResponse} - The created Review
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the Review content is empty or a stream of empty spaces
 * @throws {413} - If the Review content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    reviewValidator.isValidReviewContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const Review = await ReviewCollection.addOne(userId, req.body.course, req.body.term, req.body.instructor, req.body.hours, req.body.knowledge, req.body.grade, req.body.content, req.body.difficulty, req.body.overallRating);

    res.status(201).json({
      message: 'Your Review was created successfully.',
      Review: util.constructReviewResponse(Review)
    });
  }
);

/**
 * Delete a Review
 *
 * @name DELETE /api/reviews/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the student of
 *                 the Review
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:reviewId?',
  [
    userValidator.isUserLoggedIn,
    reviewValidator.isReviewExists,
    reviewValidator.isValidReviewModifier
  ],
  async (req: Request, res: Response) => {
    await ReviewCollection.deleteOne(req.params.reactionId);
    res.status(200).json({
      message: 'Your Review was deleted successfully.'
    });
  }
);

/**
 * Modify a Review
 *
 * @name PATCH /api/reviews/:id
 *
 * @param {string} content - the new content for the Review
 * @return {ReviewResponse} - the updated Review
 * @throws {403} - if the user is not logged in or not the student of
 *                 of the Review
 * @throws {404} - If the reactionId is not valid
 * @throws {400} - If the Review content is empty or a stream of empty spaces
 * @throws {413} - If the Review content is more than 140 characters long
 */
router.patch(
  '/:reviewId?',
  [
    userValidator.isUserLoggedIn,
    reviewValidator.isReviewExists,
    reviewValidator.isValidReviewModifier,
    reviewValidator.isValidReviewContent
  ],
  async (req: Request, res: Response) => {
    const Review = await ReviewCollection.updateOne(req.params.reactionId,req.body.content);
    res.status(200).json({
      message: 'Your Review was updated successfully.',
      Review: util.constructReviewResponse(Review)
    });
  }
);

export {router as reactionRouter};
