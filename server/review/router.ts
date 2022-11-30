import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReviewCollection from './collection';
import CourseCollection from '../course/collection';
import * as userValidator from '../user/middleware';
import * as courseValidator from '../course/middleware';
import * as enrollValidator from '../enroll/middleware';
import * as reviewValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all reviews
 */
 router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const allReviews = await ReviewCollection.findAll();
    const response = allReviews.map(util.constructReviewResponse);
    res.status(200).json(response);
  }
);

/**
 * Get reviews by course name
 */
router.get(
  '/course/:name',
  [
    courseValidator.isCourseExistsParamName, 
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const courseReviews = await ReviewCollection.findAllByCourse(req.params.name as string);
    const response = courseReviews.map(util.constructReviewResponse);
    res.status(200).json(response);
  }
);

/**
 * Get reviews by student with name `student`
 */
 router.get(
  '/student/:student',
  [
    userValidator.isParamStudentExists, 
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const studentReviews = await ReviewCollection.findAllByUsername(req.params.student as string);
    const response = studentReviews.map(util.constructReviewResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Review in req.params.course
 *
 * @name POST /api/reviews/:course
 *
 * @return {ReviewResponse} - The created Review
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the Review content is empty or a stream of empty spaces
 * @throws {413} - If the Review content is more than 140 characters long
 */
router.post(
  '/:course?',
  [
    userValidator.isUserLoggedIn,
    enrollValidator.isEnrollExists,
    reviewValidator.isValidReviewContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    // const course = await CourseCollection.findOneByName(req.params.course);
    console.log(req.body.instructor);
    console.log(req.body.instructor ?? '');
    const review = await ReviewCollection.addOne(userId, req.params.course, req.body.term ?? '', req.body.instructor ?? '', req.body.hours ?? 0, req.body.knowledge ?? '', req.body.grade ?? '', req.body.content, req.body.difficulty === '*' ? 0 : req.body.difficulty, req.body.overallRating === '*' ? 0 : req.body.overallRating);

    res.status(201).json({
      message: 'Your review was created successfully.',
      review: util.constructReviewResponse(review)
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
    await ReviewCollection.deleteOne(req.params.reviewId);
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
    const review = await ReviewCollection.updateOne(req.params.reviewId, req.body.term, req.body.instructor, req.body.hours, req.body.knowledge, req.body.grade, req.body.content, req.body.difficulty, req.body.overallRating);
    res.status(200).json({
      message: 'Your Review was updated successfully.',
      review: util.constructReviewResponse(review)
    });
  }
);

export {router as reviewRouter};
