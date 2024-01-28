import mongoose from "mongoose";


const FakeCompany = {
    name: "RaptureElectronics",
    country: "France",
    phone: "+33/---------/",
    service: "RaptureOS",
    duePay: "10$"
};

export interface InvoiceInterface {
    companyName: string;
    companyCountry: string;
    phone: string;
    service: string;
    userId: mongoose.Types.ObjectId;
    userEmail: string;
    userCountry: string;
    dueDate: Date;
    duePay: string;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface InvoiceCreateInterface {
    userId: string;
    dueDate: Date;
    isPaid: boolean;
}

const invoiceSchema = new mongoose.Schema({
    companyName: {
        type: String,
        default: FakeCompany.name
    },
    companyCountry: {
        type: String,
        default: FakeCompany.country
    },
    phone: {
        type: String,
        default: FakeCompany.phone
    },
    service: {
        type: String,
        default: FakeCompany.service
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    userEmail: {
        type: String,
        required: true
    },
    userCountry: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    duePay: {
        type: String,
        default: FakeCompany.duePay
    },
    isPaid: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

export default mongoose.model<InvoiceInterface>("Invoice", invoiceSchema);

