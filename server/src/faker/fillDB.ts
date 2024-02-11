import { createFakeUsers } from "./createFakeUsers";
import { appConfig } from "../config/appConfig";
import { ROLES } from "../middleware/verifyRoles";
import mongoose from "mongoose";
import env from "../config/env";

const N_invoices = appConfig.random_invoices_to_generate;

const fillDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI_DEV, { dbName: env.MONGO_DB_DEV });
        await createFakeUsers(10, N_invoices);
        await createFakeUsers(10, N_invoices, ROLES.reader);
        await createFakeUsers(1, N_invoices, ROLES.owner);
        mongoose.disconnect();
    }
    catch(error){
        console.log(error);
    }

};

if(env.NODE_ENV === "development"){
    fillDB();
}
else {
    console.log("Not in dev mode");
}