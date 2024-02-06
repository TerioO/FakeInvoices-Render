import s from "../../styles/Invoices.module.scss";
import { useGetInvoicePDF } from "../../hooks/useGetInvoicePDF";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Button } from "@mui/material";

export default function SingleInvoice() {
    const { userId, invoiceId } = useParams<{
        userId: string;
        invoiceId: string;
    }>();
    const { url, isLoading, isSuccess, error } = useGetInvoicePDF({
        userId,
        invoiceId,
    });

    const loadingContent = isLoading && (
        <div className={s.Loading}>
            <CircularProgress />
        </div>
    );

    const successContent = isSuccess && (
        <div className={s.Success}>
            <h1>Invoice - {invoiceId?.substring(18)}</h1>
            <div>
                <a href={url} target="_blank">
                    <Button variant="outlined">View PDF</Button>
                </a>
                <a href={url} download={`Invoice_${invoiceId?.substring(18)}.pdf`}>
                    <Button variant="outlined">Download PDF</Button>
                </a>
            </div>
        </div>
    );

    const errorContent = error && (
        <div className={s.Error}>
            <p>{error}</p>
        </div>
    );

    return (
        <div className={s.SingleInvoice}>
            {loadingContent}
            {successContent}
            {errorContent}
        </div>
    );
}
