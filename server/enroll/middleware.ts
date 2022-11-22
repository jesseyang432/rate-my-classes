import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import EnrollCollection from '../enroll/collection';
import CourseCollection from '../course/collection';

/**
 * Checks if a user is following the other
 */

const isEnrollExists = async (req: Request, res: Response, next: NextFunction) => {
    const toClass = await CourseCollection.findOne(req.params.author as string);
    const enroll = await EnrollCollection.findOne(req.session.userId, toClass._id);
    if (!enroll) {
        res.status(404).json({
        error: {
            followNotFound: `Enroll from USER ID ${req.session.userId} to ${toClass._id} does not exist.`
        }
        });
        return;
    }
    next();
};


/**
 * Checks if a user is not following the other
 */

const isEnrollNotExists = async (req: Request, res: Response, next: NextFunction) => {
    const toClass = await CourseCollection.findOne(req.params.author as string);
    const follow = await EnrollCollection.findOne(req.session.userId, toClass._id);
    if (follow) {
        res.status(409).json({
        error: {
            followAlreadyExists: `Follow from USER ID ${req.session.userId} to ${toClass._id} already exists.`
        }
        });
        return;
    }
    next();
};

export {
    isEnrollExists,
    isEnrollNotExists
}
