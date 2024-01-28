import s from "../../styles/Invoices.module.scss";
import { useEffect, useRef } from "react";
import { useLazyGetUserQuery } from "../users/usersApiSlice";
import { useLazyGetInvoiceQuery } from "./invoiceApiSlice";
import { useParams } from "react-router-dom";
import CircularProgressCenter from "../../components/utils/CircularProgressCenter";
import CustomSnackbar from "../../components/utils/CustomSnackbar";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button, } from "@mui/material";

export default function SingleInvoice() {
    const { userId, invoiceId } = useParams();
    const pdfRef = useRef<HTMLDivElement | null>(null);

    const [
        getUser,
        {
            isLoading: isLoadingUser,
            data: dataUser,
            error: errorUser,
            isSuccess: isSuccessUser,
            isError: isErrorUser,
        },
    ] = useLazyGetUserQuery();
    const [
        getInvoice,
        {
            isLoading: isLoadingInvoice,
            data: dataInvoice,
            error: errorInvoice,
            isSuccess: isSuccessInvoice,
            isError: isErrorInvoice,
        },
    ] = useLazyGetInvoiceQuery();

    useEffect(() => {
        if (userId && invoiceId) {
            getUser({ userId }, true);
            getInvoice({ invoiceId }, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, invoiceId]);

    const handleDownloadPDF = () => {
        const input = pdfRef.current;
        if (input instanceof HTMLElement) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4", false);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(
                    pdfWidth / imgWidth,
                    pdfHeight / imgHeight
                );
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 10;
                const marginLeft = 6;
                pdf.addImage(
                    imgData,
                    "PNG",
                    imgX + marginLeft/2,
                    imgY,
                    imgWidth * ratio - marginLeft,
                    imgHeight * ratio
                );
                pdf.save(`Invoice ${dataInvoice?.invoice._id.substring(18)}.pdf`);
            });
        }
    };

    let content;
    let downloadButtons;
    if (isSuccessInvoice && isSuccessUser) {
        const user = dataUser?.user;
        const invoice = dataInvoice?.invoice;
        content = (
            <div className={s.InvoiceBody} ref={pdfRef}>
                <div className={s.InvoiceCompany}>
                    <div className={s.CompanyDetails}>
                        <h1>INVOICE</h1>
                        <p>
                            No. {invoice?._id.substring(18)} - Due{" "}
                            {dayjs(invoice?.dueDate).format("DD MMMM YYYY")}
                        </p>
                        <p>{invoice?.companyName}</p>
                        <p>{invoice?.companyCountry}</p>
                        <p>{invoice?.phone}</p>
                    </div>
                    <div className={s.CompanyLogo}>
                        <div>LOGO</div>
                    </div>
                </div>
                <div className={s.UserSection}>
                    <p>Invoice To:</p>
                    <p>
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p>{user?.country}</p>
                    <p>{user?.phone}</p>
                    <p>{user?.email}</p>
                </div>
                <div className={s.Details}>
                    <div>
                        <p>Description</p>
                        <p>Quantity</p>
                        <p>Unit Cost</p>
                        <p>Amount</p>
                    </div>
                    <div>
                        <p>{invoice?.service}</p>
                        <p>1</p>
                        <p>{invoice?.duePay}</p>
                        <p>{invoice?.duePay}</p>
                    </div>
                    <div>
                        <p>Total: {invoice?.duePay}</p>
                    </div>
                </div>
            </div>
        );
        downloadButtons = (
            <div className={s.DownloadButtons}>
                <Button variant="outlined" onClick={handleDownloadPDF}>
                    DOWNLOAD PDF
                </Button>
            </div>
        );
    } else if (isErrorInvoice || isErrorUser)
        content = (
            <>
                <h1>INVOICE</h1>
                <p className={s.FailToFetch}>
                    Ooops, failed to fetch resources.
                </p>
            </>
        );

    return (
        <div className={s.SingleInvoice}>
            {downloadButtons}
            <CustomSnackbar message={errorUser || errorInvoice} />
            {(isLoadingInvoice || isLoadingUser) && <CircularProgressCenter />}
            {content}
        </div>
    );
}
