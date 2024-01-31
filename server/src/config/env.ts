import { cleanEnv, str, port } from "envalid";
import "dotenv/config";

const env = cleanEnv(process.env, {
    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_SECRET: str(),
    PORT: port({ default: 3500 }),
    MONGO_URI_DEV: str(),
    MONGO_URI_PROD: str(),
    MONGO_DB_DEV: str(),
    MONGO_DB_PROD: str(),
    DOMAINS_DEV: str({ default: "http://localhost:5173&&http://localhost:4173" }),
    DOMAINS_PROD: str(),
    DOMAIN_CLIENT_PROD: str(),
    EMAIL_PASS: str(),
    EMAIL_USER: str(),
    EMAIL_TOKEN_SECRET: str(),
    NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
});

export default env;