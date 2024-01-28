import s from "../../styles/Invoices.module.scss";
import React, { useState, useEffect } from "react";
import { Invoice, useLazyGetAllInvoicesQuery } from "./invoiceApiSlice";
import {
    Pagination,
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

const limit = 40;

export default function InvoicesList() {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [getAllInvoices, { isFetching, isSuccess, error, data }] =
        useLazyGetAllInvoicesQuery();

    useEffect(() => {
        if (!isFetching) getAllInvoices({ limit, page }, true);
    }, [page]);

    const pages = data ? Math.ceil(data.invoicesArrayLen / limit) : 1;

    const handlePageChange = (
        _e: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    let content;
    if (isSuccess) {
        content = data?.invoices.map((invoice: Invoice, i: number) => (
            <TableRow
                key={invoice._id}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/single-invoice/${invoice.userId}/${invoice._id}`)}
            >
                <TableCell>{(page - 1) * limit + (i + 1)}</TableCell>
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
        <div className={s.InvoicesList}>
            <h1>All Invoices</h1>
            <p>Click on row to open details.</p>
            <CustomSnackbar message={error} />
            {isFetching && <CircularProgressCenter />}
            <div className={s.Pagination}>
                <Pagination
                    size="small"
                    color="primary"
                    count={pages}
                    page={page}
                    onChange={handlePageChange}
                />
            </div>
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
        </div>
    );
}
