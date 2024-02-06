import { UserCreateInterface } from "../models/User";
import { faker } from "@faker-js/faker";
import User from "../models/User";
import Invoice, { FakeCompany, InvoiceCreateInterface } from "../models/Invoice";
import { ROLES } from "../middleware/verifyRoles";
import bcrypt from "bcrypt";

export const createFakeUsers = async (N_users: number, N_invoices: number, role?: string) => {
    try {
        const newUsers: UserCreateInterface[] = [];
        for (let i = 0; i < N_users; i++) {
            const firstName = faker.person.firstName();
            const newUser: UserCreateInterface = {
                firstName,
                lastName: faker.person.lastName(),
                email: `${firstName}@fake.com`,
                password: bcrypt.hashSync(`${firstName}-00000`, 10),
                country: faker.location.country(),
                phone: faker.phone.imei(),
                role: role ?? ROLES.user,
                verification: {
                    isVerified: true
                }
            };
            newUsers.push(newUser);
        }
        const users = await User.insertMany(newUsers, { ordered: false });
        for(let i=0; i<users.length; i++){
            const len = await createFakeInvoices(users[i]._id.toString(), users[i].role, N_invoices);
            console.log(`User ${users[i].firstName} created with: ${len} invoices`);
        }
    }
    catch (error) {
        console.log(error);
    }

};

export async function createFakeInvoices(userId: string, userRole: string, N: number) {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    let month = currentMonth;
    let year = currentYear;
    const limit = N || 12;
    const randomQuantity = Math.floor(Math.random() * 4) + 1;

    const newInvoices: InvoiceCreateInterface[] = [];
    for (let j = 0; j < limit; j++) {
        if (month == 0) {
            month = 12;
            year -= 1;
        }
        const newInvoice: InvoiceCreateInterface = {
            user: {
                id: userId,
                role: userRole
            },
            quantity: randomQuantity,
            dueDate: new Date(`${year}-${month}-27`),
            duePay: randomQuantity * FakeCompany.price.value + FakeCompany.price.denomination,
            isPaid: true
        };
        newInvoices.push(newInvoice);
        month -= 1;
    }
    const invoices = await Invoice.insertMany(newInvoices);
    return invoices.length;
}