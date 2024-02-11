import { UserLeanInterface } from "../../models/User";
import { InvoiceFlatInterface } from "../../models/Invoice";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { FakeCompany } from "../../models/Invoice";
import dayjs from "dayjs";

/**
 * Template for invoice PDF
 * @param user - DB entry of user
 * @param invoice - DB entry of invoice
 * @returns 
 */
export const createInvoicePDF = (user: UserLeanInterface, invoice: InvoiceFlatInterface) => {
    const UnitCost = `${FakeCompany.price.value}${FakeCompany.price.denomination}`;
    const Amount = `${invoice.quantity * FakeCompany.price.value}${FakeCompany.price.denomination}`;
    const docDefinition: TDocumentDefinitions = {
        content: [
            { text: `Invoice nr. ${invoice._id.toString().substring(18)}`, style: "header" },
            { text: `Due date: ${dayjs(invoice.dueDate).format("DD MMM YYYY")}` },
            { text: `${invoice.company.name}`, margin: [0, 8, 0, 0] },
            { text: `${invoice.company.country}` },
            { text: `${invoice.company.phone}` },
            { text: "Bill To:", margin: [0, 40, 0, 0], fontSize: 18, bold: true },
            { text: `${user.lastName} ${user.firstName}`, margin: [0, 8, 0, 0] },
            { text: `${user.email}` },
            { text: `${user.country}` },
            { text: `${user.phone}` },
            {
                layout: "lightHorizontalLines",
                table: {
                    headerRows: 1,
                    widths: ["*", "*", "*", "*"],

                    body: [
                        ["Description", "Quantity", "Unit Cost", "Amount"],
                        [`${invoice.company.service}`, `${invoice.quantity}`, UnitCost, Amount],
                    ]
                },
                margin: [0, 40, 0, 0]
            },
            { text: `Total: ${Amount}`, margin: [0, 80, 0, 0], fontSize: 22, bold: true }
        ],

        defaultStyle: {
            font: "Helvetica"
        },

        styles: {
            header: {
                fontSize: 22,
                bold: true
            }
        }
    };
    return docDefinition;
};