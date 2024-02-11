import env from "./env";

interface AppConfig {
    access_token_expires: string;
    refresh_token_expires: string;
    email_token_expires: string;
    cookie_max_age: number;
    time_before_sending_another_verification_email: number;
    random_invoices_to_generate: number;
    saltRounds: number;
    request_message_length: number;
}

export const appConfig: AppConfig = {
    access_token_expires: env.isDev ? "1d" : "7d",
    refresh_token_expires: env.isDev ? "2d" : "14d",
    email_token_expires: env.isDev ? "60s" : "900s",
    cookie_max_age: env.isDev ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60 * 24 * 14, 
    time_before_sending_another_verification_email: env.isDev ? 1000 * 60 * 1 : 1000 * 60 * 15,
    random_invoices_to_generate: 15,
    saltRounds: 10,
    request_message_length: 200,
};

