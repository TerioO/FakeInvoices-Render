import s from "../../styles/Invoices.module.scss";
import { useGetInvoicePDF } from "../../hooks/useGetInvoicePDF";
import { useLazyGetInvoicePDFtoEmailQuery } from "./invoiceApiSlice";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Button } from "@mui/material";
import CustomSnackbar from "../../components/utils/CustomSnackbar";

export default function SingleInvoice() {
    const { userId, invoiceId } = useParams<{
        userId: string;
        invoiceId: string;
    }>();
    const { url, isLoading, isSuccess, error } = useGetInvoicePDF({
        userId,
        invoiceId,
    });

    const [
        sendPdfToEmail,
        { isLoading: isLoadingSend, error: errorSend, data: dataSend },
    ] = useLazyGetInvoicePDFtoEmailQuery();

    const handleSendPdfToEmail = async () => {
        await sendPdfToEmail({ userId, invoiceId });
    };

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
                <a
                    href={url}
                    download={`Invoice_${invoiceId?.substring(18)}.pdf`}
                >
                    <Button variant="outlined">Download PDF</Button>
                </a>
                <Button
                    variant="outlined"
                    onClick={handleSendPdfToEmail}
                    disabled={isLoadingSend}
                >
                    SEND TO EMAIL
                </Button>
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
            <CustomSnackbar message={dataSend?.message}/>
            <CustomSnackbar message={errorSend} />
        </div>
    );
}
