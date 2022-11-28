import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CourseCollection from './collection';
import * as util from './util';
import * as courseValidator from '../course/middleware';

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

/**
 * Get a course by its name
 */
router.get(
  '/:name',
  [courseValidator.isCourseExists],
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await CourseCollection.findOneByName(req.params.name);
    const response = util.constructCourseResponse(course);
    res.status(200).json(response);
  },
)

export {router as courseRouter};
