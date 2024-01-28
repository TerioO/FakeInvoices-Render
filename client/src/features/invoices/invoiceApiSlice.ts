import { apiSlice } from "../../app/api/apiSlice";

export interface Invoice {
    _id: string;
    companyName: string;
    companyCountry: string;
    phone: string;
    service: string;
    userId: string;
    userEmail: string;
    userCountry: string;
    dueDate: Date;
    duePay: string;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface GetInvoice {
    invoice: Invoice;
}

interface GetInvoices {
    invoices: Invoice[];
}

interface GetAllInvoices {
    invoices: Invoice[];
    invoicesArrayLen: number;
}

const rootPath = "/invoice";

const createTags = (result: GetInvoices | undefined) => {
    const tags = [{
        type: "Invoice" as const, id: "LIST"
    }]
    if (result?.invoices) tags.concat(result.invoices.map((el) => ({
        type: "Invoice" as const, id: el._id
    })));
    return tags;
}

const invoiceApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getInvoice: build.query<GetInvoice, { invoiceId: string }>({
            query: ({ invoiceId }) => `${rootPath}/single?invoiceId=${invoiceId}`,
            providesTags: (result) => {
                const tags = [{
                    type: "Invoice" as const, id: "LIST"
                }]
                if (result?.invoice) tags.push({ type: "Invoice" as const, id: result.invoice._id});
                return tags;
            }
        }),
        getAllInvoices: build.query<GetAllInvoices, { limit?: number, page?: number }>({
            query: ({ limit, page }) => `${rootPath}/all?page=${page}&limit=${limit}`,
            providesTags: (result) => {
                return createTags(result);
            }
        }),
        getUsersInvoices: build.query<GetInvoices, { userId: string }>({
            query: ({ userId }) => `${rootPath}/users-invoices?userId=${userId}`,
            providesTags: (result) => {
                return createTags(result);
            }
        }),
        getMyInvoices: build.query<GetInvoices, void>({
            query: () => `${rootPath}/my-invoices`,
            providesTags: (result) => {
                return createTags(result);
            }
        })
    })
})

export const {
    useLazyGetAllInvoicesQuery,
    useLazyGetInvoiceQuery,
    useLazyGetMyInvoicesQuery,
    useLazyGetUsersInvoicesQuery
} = invoiceApiSlice;