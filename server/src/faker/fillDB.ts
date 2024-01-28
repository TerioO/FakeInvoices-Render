import { createUsers } from "./createUsers";
// import { createInvoices } from "./createInvoices";

const DOMAIN = "http://localhost:3500";

const fillDB = async () => {
    await createUsers(DOMAIN, 80);
    // await createInvoices(DOMAIN, 12);
};

fillDB();