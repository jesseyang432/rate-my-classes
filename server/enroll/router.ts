import type {Request, Response} from 'express';
import express from 'express';
import EnrollCollection from './collection';
import CourseCollection from '../course/collection';
import * as userValidator from '../user/middleware';
import * as enrollValidator from '../enroll/middleware';
import { constructEnrollResponse } from './util';


const router = express.Router();

/**
 * Attempts to enroll logged in user in course `req.body.courseToEnroll`
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    enrollValidator.isEnrollNotExists
  ],
  async (req: Request, res: Response) => {
      const toCourse = await CourseCollection.findOneByName(req.body.courseToEnroll as string);
      const enrollment = await EnrollCollection.addOne(req.session.userId, toCourse._id);

      res.status(201).json({
        message: `Your enrollment was created successfully.`,
        enroll: enrollment
      });
  }
);

 router.delete(
  '/:course?',
  [
    userValidator.isUserLoggedIn,
    enrollValidator.isEnrollExists
  ],
  async (req: Request, res: Response) => {
    const toCourse = await CourseCollection.findOneByName(req.params.course as string);
    const enrollment = await EnrollCollection.deleteOne(req.session.userId, toCourse._id);

    res.status(201).json({
      message: 'Your enrollement was deleted successfully.',
      enroll: enrollment
    });
  }
);

router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const enrollments = await EnrollCollection.findAllbyStudent(req.session.userId);
    res.status(201).json(enrollments);
  }
)

export {router as enrollRouter};