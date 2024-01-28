import mongoose from "mongoose";

export interface UserInterface {
    firstName: string,
    lastName: string,
    country: string,
    email: string,
    phone: string,
    password: string,
    roles: string[],
    createdAt: Date,
    updatedAt: Date
}

export interface UserCreateInterface {
    firstName: string,
    lastName: string,
    country: string,
    email: string,
    phone: string,
    password: string
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: "USER"
    }
}, { timestamps: true });

export default mongoose.model<UserInterface>("User", userSchema);

