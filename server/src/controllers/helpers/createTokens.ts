import env from "../../config/env";
import jwt from "jsonwebtoken";
import { appConfig } from "../../config/appConfig";

export interface ResLocals {
    id: string,
    firstName: string,
    role: string,
    isVerified: boolean,
}

export interface RefreshTokenPayload {
    UserInfo: {
        id: string
    }
}

export interface AccessTokenPayload {
    UserInfo: ResLocals
}

export const createAccessToken = (payload: AccessTokenPayload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: appConfig.access_token_expires });
};

export const createRefreshToken = (payload: RefreshTokenPayload) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: appConfig.refresh_token_expires });
};

export const createEmailToken = (payload: { userId: string }) => {
    return jwt.sign(payload, env.EMAIL_TOKEN_SECRET, { expiresIn: appConfig.email_token_expires });
};