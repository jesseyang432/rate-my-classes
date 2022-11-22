import type {HydratedDocument, Types} from 'mongoose';
import type {Enroll} from './model';
import EnrollModel from './model';

class EnrollCollection {

    static async addOne(fromStudent: Types.ObjectId | string, toClass: Types.ObjectId | string): Promise<HydratedDocument<Enroll>> {
        const bond = new EnrollModel({
            fromStudent: fromStudent,
            toClass: toClass
        });
        await bond.save();
        return bond;
    }

    static async deleteOne(fromStudent: Types.ObjectId | string, toClass: Types.ObjectId | string): Promise<Boolean> {
        const bond = await EnrollModel.deleteOne({
            fromStudent: fromStudent,
            toClass: toClass
        })
        return bond !== null;
    }

     static async findOne(fromStudent: Types.ObjectId | string, toClass: Types.ObjectId | string): Promise<HydratedDocument<Enroll>> {
        return EnrollModel.findOne({
            fromStudent: fromStudent,
            toClass: toClass
        })
    }

    static async findAllbyStudent(fromStudent: Types.ObjectId | string): Promise<Array<HydratedDocument<Enroll>>> {
        return EnrollModel.find({
            fromStudent: fromStudent
        })
    }

    static async findAllbyClass(toClass: Types.ObjectId | string): Promise<Array<HydratedDocument<Enroll>>> {
        return EnrollModel.find({
            toClass: toClass
        })
    }
}
export default EnrollCollection;