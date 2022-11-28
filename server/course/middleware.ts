import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CourseCollection from '../course/collection';

/**
 * Checks if a course exists based on `req.params.name`
 */

const isCourseExists = async (req: Request, res: Response, next: NextFunction) => {
    const toCourse = await CourseCollection.findOneByName(req.params.name as string);
    if (!toCourse) {
        res.status(404).json({
        error: {
            courseNotFound: `Course ${req.params.name} does not exist.`
        }
        });
        return;
    }
    next();
};

export {
  isCourseExists,
}