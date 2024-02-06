import { createEmailToken } from "./createTokens";
import env from "../../config/env";
import { UserLeanInterface } from "../../models/User";
import { Request } from "express";
import { appConfig } from "../../config/appConfig";

export interface EmailPayload {
    subject: string;
    sender: {
        name: string;
        email: string;
    }
    to: {
        name: string;
        email: string;
    }[],
    htmlContent: string;
}

/**
 * Send a verification link to user email using the fetch & brevo API.
 * @param {UserLeanInterface} user - The user object returned from mongoose **.lean()** method.
 * @param {Request} req - The **req** object from Express.
 * @returns {Promise} A message to be sent as response.
 */
export const sendVerificationEmail = async (user: UserLeanInterface, req: Request) => {
    const { _id, firstName, email, verification } = user;

    // Check if enough time has passed before sending another verification email:
    let canSend: boolean = false;
    let dt: number = 0;
    let mm;
    let ss;
    if (!verification.emailSentAt) {
        canSend = true;
    }
    else if (verification.emailSentAt && Date.now() - verification.emailSentAt.getTime() < appConfig.time_before_sending_another_verification_email) {
        canSend = false;
        dt = Date.now() - verification.emailSentAt.getTime();
        const waitTime = appConfig.time_before_sending_another_verification_email - dt;
        const m = Math.floor(waitTime / 1000 / 60);
        const s = Math.floor(waitTime / 1000 % 60);
        mm = m < 10 ? `0${m}` : `${m}`;
        ss = s < 10 ? `0${s}` : `${s}`;
    }
    else {
        canSend = true;
    }
    if (!canSend) {
        return {
            status: 400,
            message: `You need to wait ${mm}:${ss} before sending another verification email`
        };
    }
    const emailToken = createEmailToken({ userId: _id.toString() });
    const currentDomain = env.isDevelopment
        ? req.headers.origin
        : env.DOMAIN_CLIENT_PROD;
    const href = `${currentDomain}/verify/${emailToken}`;
    const payload: EmailPayload = {
        sender: {
            name: "Terio - Fake Invoices",
            email: env.EMAIL_USER
        },
        to: [{
            name: firstName,
            email: email
        }],
        subject: `Verification link for ${currentDomain}`,
        htmlContent: `
            <p>
                Click the link to verify your account, the link expires in ${appConfig.email_token_expires} from the moment it was sent not the 
                moment it got received in the inbox.
            </p>
            <br/>
            <a href=${href}>${href}</a>
        `
    };
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            headers: {
                "Content-Type": "application/json",
                "api-key": env.EMAIL_API_KEY,
                "Accept": "application/json"
            },
            method: "POST",
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            return {
                status: 200,
                message: "Verification email sent"
            };
        }
    }
    catch (error) {
        if (env.isDev) console.log(error);
        return {
            status: 400,
            message: "API failed to send verification email"
        };
    }
};