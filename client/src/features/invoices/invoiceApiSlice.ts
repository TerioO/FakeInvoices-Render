import { apiSlice } from "../../app/api/apiSlice";

export interface Invoice {
    _id: string;
    company: {
        name: string;
        country: string;
        phone: string;
        service: string;
    };
    user: {
        id: string;
        role: string;
    };
    quantity: number;
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
                if (result?.invoice) tags.push({ type: "Invoice" as const, id: result.invoice._id });
                return tags;
            }
        }),
        getAllInvoices: build.query<GetAllInvoices, { limit?: number, page?: number }>({
            query: ({ limit, page }) => `${rootPath}/all?page=${page}&limit=${limit}`,
            providesTags: (result) => {
                return createTags(result);
            }
        }),
        getUsersInvoices: build.query<GetInvoices, { userId: string | undefined }>({
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
        }),
        getInvoicePDFtoEmail: build.query<{ message: string }, { invoiceId: string | undefined; userId: string | undefined }>({
            query: ({ userId, invoiceId }) => `${rootPath}/invoice-pdf-email?userId=${userId}&invoiceId=${invoiceId}`
        })
    })
})

export const {
    useLazyGetAllInvoicesQuery,
    useLazyGetInvoiceQuery,
    useLazyGetMyInvoicesQuery,
    useLazyGetUsersInvoicesQuery,
    useGetUsersInvoicesQuery,
    useLazyGetInvoicePDFtoEmailQuery,
} = invoiceApiSlice;