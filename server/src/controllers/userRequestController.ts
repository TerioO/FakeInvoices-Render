import { Request, Response, NextFunction } from "express";
import UserRequest, { UserRequestCreateI, userRequestsSortOptions } from "../models/UserRequest";
import createHttpError from "http-errors";
import { ResLocals } from "./helpers/createTokens";
import { validateObjectId } from "../constants/validateObjectId";
import { appConfig } from "../config/appConfig";

// [MUTATIONS] ----------------------------------------------------------------------------------------------------------------------------------------------
/**
 * USERs & READERs should be able to create requests for the OWNER
 */
export const createUserRequest = async (req: Request<unknown, unknown, { message: string }, unknown>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { message } = req.body;
    const { id } = res.locals;
    try {
        if (!id) throw createHttpError(401, "Not logged in");
        if (!message) throw createHttpError(400, "message required");
        if (message.length > appConfig.request_message_length) throw createHttpError(400, "Exceeded message limit of 200 characters");

        const newUserRequest: UserRequestCreateI = {
            userId: id,
            message
        };
        const userRequest = await UserRequest.create(newUserRequest);
        if (!userRequest) throw createHttpError(400, "Invalid data received");
        res.status(200).json({ message: "Request made!", userRequest });
    }
    catch (error) {
        next(error);
    }
};

/**
 * USERs & READERs should be able to delete their own request
 */
export const deleteRequest = async (req: Request<unknown, unknown, { requestId: string }, unknown>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { id } = res.locals;
    const { requestId } = req.body;
    try {
        // Validation:
        if (!id) throw createHttpError(401, "Not logged in");
        if (!requestId) throw createHttpError(400, "requestId required");
        validateObjectId(requestId);

        // Delete where userId matches my id:
        const foundRequest = await UserRequest.deleteOne({ _id: requestId, userId: id });
        if (foundRequest.deletedCount != 1) throw createHttpError(404, "Request not found, nothing to delete");

        res.status(200).json({ message: "Request deleted!" });
    }
    catch (error) {
        next(error);
    }
};


type UpdateRequestBody = {
    requestId: string;
    fulfilled: ("PENDING" | "FULFILLED" | "REJECTED");
}
/**
 * OWNERs should be able to update the fulfilled status of a request
 */
export const updateRequest = async (req: Request<unknown, unknown, UpdateRequestBody, unknown>, res: Response, next: NextFunction) => {
    const { requestId, fulfilled } = req.body;
    try {
        // Validation:
        if (!["PENDING", "FULFILLED", "REJECTED"].includes(fulfilled)) throw createHttpError(400, "Invalid fulfilled value");
        if (!requestId) throw createHttpError(400, "requestId required");
        validateObjectId(requestId);

        const request = await UserRequest.findById(requestId);
        if (!request) throw createHttpError(404, "No request found");
        request.fulfilled = fulfilled;
        await request.save();
        res.status(200).json({ message: `Request - ${requestId} updated with status  ${fulfilled}` });
    }
    catch (error) {
        next(error);
    }
};

// [QUERIES] ----------------------------------------------------------------------------------------------------------------------------------------------

type GetRequestsQuery = {
    limit: string;
    page: string;
    sort: string;
    fulfilled: string;
}
/**
 * OWNERs should be able to read all the requests made
 * - Uses pagination
 */
export const getRequests = async (req: Request<unknown, unknown, unknown, GetRequestsQuery>, res: Response, next: NextFunction) => {
    const { limit, page, sort, fulfilled } = req.query;
    let l: number = 20;
    let p: number = 1;
    if (!isNaN(parseInt(limit)) && parseInt(limit) > 0) l = parseInt(limit);
    if (!isNaN(parseInt(page)) && parseInt(page) > 1) p = parseInt(page);
    const fulfilledOptions = ["PENDING", "FULFILLED", "REJECTED"];
    try {
        const query = fulfilledOptions.includes(fulfilled) ? { fulfilled: fulfilled } : {};
        const userRequests = await UserRequest.find(query)
            .limit(l)
            .skip((p - 1) * l)
            .sort(userRequestsSortOptions.includes(sort) ? sort : userRequestsSortOptions[1])
            .lean().exec();
        if (userRequests.length === 0) throw createHttpError(404, "Requests not found");
        const count = await UserRequest.countDocuments(query);
        res.status(200).json({ userRequests, count });
    }
    catch (error) {
        next(error);
    }
};

type GetMyRequestsQuery = {
    limit: string;
    page: string;
    sort: string
};
/**
 * USERs & READERs should be able to read their own requests
 */
export const getMyRequests = async (req: Request<unknown, unknown, unknown, GetMyRequestsQuery>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { id } = res.locals;
    const { sort, limit, page } = req.query;
    let l: number = 20;
    let p: number = 1;
    if (!isNaN(parseInt(limit)) && parseInt(limit) > 0) l = parseInt(limit);
    if (!isNaN(parseInt(page)) && parseInt(page) > 1) p = parseInt(page);
    try {
        if (!id) throw createHttpError(401, "Not logged in");
        const myRequests = await UserRequest.find({ userId: id })
            .sort(userRequestsSortOptions.includes(sort) ? sort : userRequestsSortOptions[1])
            .limit(l)
            .skip((p - 1) * l)
            .lean().exec();
        if (myRequests.length === 0) throw createHttpError(404, "No requests found");
        const count = await UserRequest.countDocuments({ userId: id });
        res.status(200).json({ myRequests, count });
    }
    catch (error) {
        next(error);
    }
};

