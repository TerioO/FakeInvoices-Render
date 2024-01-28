import { UserCreateInterface } from "../models/User";
import { faker } from "@faker-js/faker";


export const createUsers = async (DOMAIN: string, N: number) => {
    const createUser = async (user: UserCreateInterface) => {
        try {
            const response = await fetch(`${DOMAIN}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            if(response.ok) console.log("Created a user.");
        }
        catch(error){
            console.log(error);
        }
    };

    for(let i=0; i<N; i++){
        const firstName = faker.person.firstName();
        const email = `${firstName}@fake.com`;
        await createUser({
            firstName,
            lastName: faker.person.lastName(),
            email,
            password: firstName,
            phone: faker.phone.imei(),
            country: faker.location.country()
        });
    }
};