import s from "../../styles/Invoices.module.scss";
import { useEffect } from "react";
import { Invoice, useLazyGetMyInvoicesQuery } from "./invoiceApiSlice";
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgressCenter from "../../components/utils/CircularProgressCenter";
import CustomSnackbar from "../../components/utils/CustomSnackbar";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import dayjs from "dayjs";

export default function MyInvoices() {
    const navigate = useNavigate();
    const [getMyInvoices, { isLoading, isSuccess, error, data }] =
        useLazyGetMyInvoicesQuery();

    useEffect(() => {
        if (!isLoading) getMyInvoices(undefined, true);
    }, []);


    let content;
    if (isSuccess) {
        content = data?.invoices.map((invoice: Invoice, i: number) => (
            <TableRow
                key={invoice._id}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/single-invoice/${invoice.userId}/${invoice._id}`) }
            >
                <TableCell>{(i + 1)}</TableCell>
                <TableCell>{invoice._id.substring(18)}</TableCell>
                <TableCell>
                    {dayjs(invoice.dueDate).format("DD/MM/YYYY-HH:mm")}
                </TableCell>
                <TableCell>{invoice.duePay}</TableCell>
                <TableCell>
                    {invoice.isPaid ? (
                        <CheckCircleOutlineOutlinedIcon color="success" />
                    ) : (
                        <CancelOutlinedIcon color="error" />
                    )}
                </TableCell>
            </TableRow>
        ));
    }

    return (
        <div className={s.MyInvoices}>
            <h1>My Invoices</h1>
            <p>Click on row to open details.</p>
            <CustomSnackbar message={error} />
            {isLoading && <CircularProgressCenter />}
            <div className={s.InvoicesTable}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nr.</TableCell>
                                <TableCell>Invoice id</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell>Due Pay</TableCell>
                                <TableCell>Is Paid</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{content}</TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}