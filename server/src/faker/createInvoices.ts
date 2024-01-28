import { UserInterface } from "../models/User";
import { InvoiceCreateInterface } from "../models/Invoice";

interface UsersArray extends UserInterface {
    _id: string
}

interface Response {
    users: UsersArray[]
}

export const createInvoices = async (DOMAIN: string, N: number) => {
    const createInvoice = async (payload: InvoiceCreateInterface) => {
        try {
            return await fetch(`${DOMAIN}/invoice/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload) 
            });
        }
        catch(error){
            console.log(error);
        }
    };
    try {
        const response = await fetch(`${DOMAIN}/user/allUsers`);
        const json: Response = await response.json();
        const users = json.users; 

        const date = new Date();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();

        for(let i=0; i<users.length; i++){
            let month = currentMonth;
            let year = currentYear;
            for(let j=0; j<N; j++){
                if(month == 0){
                    month = 12;
                    year -= 1;
                }
                await createInvoice({
                    userId: users[i]._id,
                    dueDate: new Date(`${year}-${month}-27`),
                    isPaid: true
                });
                month -= 1;
            }
        }
    }
    catch(error){
        console.log(error);
    }
};