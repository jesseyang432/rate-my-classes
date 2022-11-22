import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CourseCollection from './collection';
import * as util from './util';

const router = express.Router();

/**
 * Get all the courses
 *
 * @name GET /api/courses
 *
 * @return {CourseResponse[]} - A list of all the courses sorted alphabetically
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const allCourses = await CourseCollection.findAll();
    const response = allCourses.map(util.constructCourseResponse);
    res.status(200).json(response);
  },
);

export {router as courseRouter};
