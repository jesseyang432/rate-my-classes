import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CourseCollection from '../course/collection';

/**
 * Checks if a user with userId as author id in req.query exists
 */
 const isCourseExists = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.course) {
      res.status(400).json({
        error: 'Provided course must be nonempty.'
      });
      return;
    }
  
    const user = await CourseCollection.findOneByName(req.query.course as string);
    if (!user) {
      res.status(404).json({
        error: `A course with name ${req.query.course as string} does not exist.`
      });
      return;
    }
  
    next();
  };
  
export {
    isCourseExists,
};
