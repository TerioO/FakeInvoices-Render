import { CorsOptions } from "cors";
import env from "./env";

let domains: string[] = [];
if(env.NODE_ENV === "development"){
    domains = env.DOMAINS_DEV.split("&&");
}
else if(env.NODE_ENV === "production"){
    domains = env.DOMAINS_PROD.split("&&");
}

const whitelist = [
    ...domains
];

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (origin && whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 204
};