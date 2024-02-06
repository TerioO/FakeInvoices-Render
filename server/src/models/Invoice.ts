import mongoose, { FlattenMaps } from "mongoose";

export const FakeCompany = {
    name: "RaptureElectronics",
    country: "France",
    phone: "+33/---------/",
    service: "RaptureOS",
    price: {
        value: 10,
        denomination: "$"
    }
};

export interface InvoiceInterface {
    company: {
        name: string;
        country: string;
        phone: string;
        service: string;
    };
    user: {
        id: mongoose.Types.ObjectId;
        role: string;
    };
    quantity: number;
    dueDate: Date;
    duePay: string;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface InvoiceFlatInterface extends FlattenMaps<InvoiceInterface> {
    _id: mongoose.Types.ObjectId;
}

export interface InvoiceCreateInterface {
    user: {
        id: string;
        role: string;
    }
    quantity: number;
    dueDate: Date;
    duePay: string;
    isPaid: boolean;
}

const invoiceSchema = new mongoose.Schema({
    company: {
        name: {
            type: String,
            default: FakeCompany.name
        },
        country: {
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
        }
    },
    user: {
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        role: {
            type: String,
            required: true
        }
    },
    quantity: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    duePay: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

export default mongoose.model<InvoiceInterface>("Invoice", invoiceSchema);

