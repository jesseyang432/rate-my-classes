import type {Request, Response} from 'express';
import express from 'express';
import EnrollCollection from './collection';
import CourseCollection from '../course/collection';
import * as userValidator from '../user/middleware';
import * as enrollValidator from '../enroll/middleware';


const router = express.Router();

router.post(
  '/:course?',
  [
    userValidator.isUserLoggedIn,
    enrollValidator.isEnrollNotExists
  ],
  async (req: Request, res: Response) => {
      const toClass = await CourseCollection.findOne(req.params.course as string);
      const enrollment = await EnrollCollection.addOne(req.session.userId, toClass._id);

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
    const toClass = await CourseCollection.findOne(req.params.course as string);
    const enrollment = await EnrollCollection.deleteOne(req.session.userId, toClass._id);

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