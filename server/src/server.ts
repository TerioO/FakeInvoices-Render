import mongoose from "mongoose";
import { createApp } from "./app";
import env from "./config/env";

const app = createApp();
let connectionString = "";
let dbName = "";
if(env.NODE_ENV === "development") {
    connectionString = env.MONGO_URI_DEV;
    dbName = env.MONGO_DB_DEV;
}
else if(env.NODE_ENV === "production"){
    connectionString = env.MONGO_URI_PROD;
    dbName = env.MONGO_DB_PROD;
}

mongoose.connect(connectionString, { dbName })
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`Connected to DB and listening on PORT: ${env.PORT}`);
        });
    })
    .catch((error) => console.log(error));