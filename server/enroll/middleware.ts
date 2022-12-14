import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import EnrollCollection from '../enroll/collection';
import CourseCollection from '../course/collection';

/**
 * Checks if a user is enrolled in course `req.params.course`
 */

const isEnrollExists = async (req: Request, res: Response, next: NextFunction) => {
    const toCourse = await CourseCollection.findOneByName(req.params.course as string);
    const enroll = await EnrollCollection.findOne(req.session.userId, toCourse._id);
    if (!enroll) {
        res.status(404).json({
        error: {
            followNotFound: `Enroll from USER ID ${req.session.userId} to ${toCourse._id} does not exist.`
        }
        });
        return;
    }
    next();
};


/**
 * Checks if a user is not enrolled in course `req.body.courseToEnroll`
 */

const isEnrollNotExists = async (req: Request, res: Response, next: NextFunction) => {
    const toCourse = await CourseCollection.findOneByName(req.body.courseToEnroll as string);
    const follow = await EnrollCollection.findOne(req.session.userId, toCourse._id);
    if (follow) {
        res.status(409).json({
        error: {
            followAlreadyExists: `Follow from USER ID ${req.session.userId} to ${toCourse._id} already exists.`
        }
        });
        return;
    }
    next();
};

/**
 * Checks that type of enrollment in `req.body.enrollmentType` is valid type
 */
const isValidEnrollmentType = async (req: Request, res: Response, next: NextFunction) => {
    const isValid = (req.body.enrollmentType === 'current' || req.body.enrollmentType === 'previous' || req.body.enrollmentType === 'interested');
    if (!isValid) {
        res.status(400).json({
        error: {
            invalidEnrollmenType: `Can not enroll as type ${req.body.enrollmentType}.`
        }
        });
        return;
    }
    next();
};

export {
    isEnrollExists,
    isEnrollNotExists,
    isValidEnrollmentType
}
