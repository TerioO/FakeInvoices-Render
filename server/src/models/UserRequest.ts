import mongoose, { FlattenMaps } from "mongoose";

export type UserRequestFulfilledType = ("PENDING" | "FULFILLED" | "REJECTED");

export interface UserRequestI {
    userId: mongoose.Types.ObjectId;
    message: string;
    fulfilled: UserRequestFulfilledType
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRequestLeanI extends FlattenMaps<UserRequestI> {
    _id: mongoose.Types.ObjectId;
}

export interface UserRequestCreateI {
    userId: string;
    message: string;
    fulfilled?: UserRequestFulfilledType
}

const userRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    fulfilled: {
        type: String,
        required: true,
        default: "PENDING"
    }
}, { timestamps: true });

export const userRequestsSortOptions = ["createdAt", "-createdAt", "updatedAt", "-updatedAt"];
export default mongoose.model<UserRequestI>("Request", userRequestSchema);