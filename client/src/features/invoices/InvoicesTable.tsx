import s from "../../styles/Invoices.module.scss";
import { Invoice } from "./invoiceApiSlice";
import dayjs from "dayjs";
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

type Props = {
    invoices: Invoice[];
    isFetching: boolean;
    isSuccess: boolean;
    page: number;
    limit: number;
};

export default function InvoicesTable({
    invoices,
    isFetching,
    isSuccess,
    page,
    limit,
}: Props) {
    let content;
    if (isSuccess) {
        content = invoices.map((invoice, i: number) => (
            <TableRow
                key={invoice._id}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                    window.open(
                        `/single-invoice/${invoice.user.id}/${invoice._id}`,
                        "_blank"
                    );
                }}
            >
                <TableCell>{(page - 1) * limit + (i + 1)}</TableCell>
                <TableCell>{invoice._id.substring(18)}</TableCell>
                <TableCell>
                    {dayjs(invoice.dueDate).format("DD/MM/YYYY")}
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
                    <TableBody>{!isFetching && content}</TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
