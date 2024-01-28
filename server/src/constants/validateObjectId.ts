import mongoose from "mongoose";
import createHttpError from "http-errors";

/**
 * Check if a string is a valid ObjectId
 * 
 * Should only be used inside **try** **catch** block
 * 
 * Throws a httpError
 * @param {string} _id 
 */
export const validateObjectId = (_id: string) => {
    if(!mongoose.isValidObjectId(_id)) throw createHttpError(400, "Invalid id used in request");
};