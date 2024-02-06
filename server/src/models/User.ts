import mongoose, { FlattenMaps } from "mongoose";
import { ROLES } from "../middleware/verifyRoles";

export interface UserInterface {
    firstName: string,
    lastName: string,
    country: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    verification: {
        isVerified: boolean;
        emailSentAt: Date;
    }
    createdAt: Date,
    updatedAt: Date
}

export interface UserLeanInterface extends FlattenMaps<UserInterface> {
    _id: mongoose.Types.ObjectId;
}

export interface UserCreateInterface {
    firstName: string,
    lastName: string,
    country: string,
    email: string,
    phone: string,
    password: string,
    role?: string,
    verification?: {
        isVerified?: boolean
        emailSetnAt?: Date
    }
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
    role: {
        type: String,
        default: ROLES.user
    },
    verification: {
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        emailSentAt: {
            type: Date
        }
    }
}, { timestamps: true });

export default mongoose.model<UserInterface>("User", userSchema);

