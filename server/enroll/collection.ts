import type {HydratedDocument, Types} from 'mongoose';
import type {Enroll} from './model';
import EnrollModel from './model';
import CourseCollection from '../course/collection';

class EnrollCollection {

    static async addOne(fromStudent: Types.ObjectId | string, toCourse: Types.ObjectId | string, enrollmentType: string): Promise<HydratedDocument<Enroll>> {
        const bond = new EnrollModel({
            fromStudent: fromStudent,
            toCourse: toCourse,
            type: enrollmentType,
        });
        await bond.save();
        return bond.populate('fromStudent toCourse');
    }

    static async deleteOne(fromStudent: Types.ObjectId | string, toCourse: Types.ObjectId | string): Promise<Boolean> {
        const bond = await EnrollModel.deleteOne({
            fromStudent: fromStudent,
            toCourse: toCourse
        });
        return bond !== null;
    }

     static async findOne(fromStudent: Types.ObjectId | string, toCourse: Types.ObjectId | string): Promise<HydratedDocument<Enroll>> {
        return EnrollModel.findOne({
            fromStudent: fromStudent,
            toCourse: toCourse
        }).populate('fromStudent toCourse');
    }

    /**
   * Update an enrollment with the new enrollment type
   */
  static async updateOne(user: Types.ObjectId | string, course: string, enrollmentType: string): Promise<HydratedDocument<Enroll>> {
    const toCourse = await CourseCollection.findOneByName(course as string);
    const enrollment = await EnrollModel.findOne({fromStudent: user, toCourse: toCourse._id});
    enrollment.type = enrollmentType;
    await enrollment.save();
    return enrollment.populate('fromStudent toCourse');
  }

    static async findAllbyStudent(fromStudent: Types.ObjectId | string): Promise<Array<HydratedDocument<Enroll>>> {
        return EnrollModel.find({
            fromStudent: fromStudent
        }).populate('fromStudent toCourse');
    }

    static async findAllbyCourse(toCourse: Types.ObjectId | string): Promise<Array<HydratedDocument<Enroll>>> {
        return EnrollModel.find({
            toCourse: toCourse
        }).populate('fromStudent toCourse');
    }
}
export default EnrollCollection;