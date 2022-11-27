import type {HydratedDocument, Types} from 'mongoose';
import type {Enroll} from './model';
import EnrollModel from './model';

class EnrollCollection {

    static async addOne(fromStudent: Types.ObjectId | string, toCourse: Types.ObjectId | string): Promise<HydratedDocument<Enroll>> {
        const bond = new EnrollModel({
            fromStudent: fromStudent,
            toCourse: toCourse
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