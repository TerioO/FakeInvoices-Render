import s from "../../styles/Invoices.module.scss";
import React, { useState, useEffect } from "react";
import { useLazyGetAllInvoicesQuery } from "./invoiceApiSlice";
import { Pagination } from "@mui/material";
import CircularProgressCenter from "../../components/utils/CircularProgressCenter";
import CustomSnackbar from "../../components/utils/CustomSnackbar";
import InvoicesTable from "./InvoicesTable";

const limit = 40;

export default function InvoicesList() {
    const [page, setPage] = useState<number>(1);
    const [getAllInvoices, { isFetching, isSuccess, error, data }] =
        useLazyGetAllInvoicesQuery();

    useEffect(() => {
        if (!isFetching) getAllInvoices({ limit, page }, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const pages = data ? Math.ceil(data.invoicesArrayLen / limit) : 1;

    const handlePageChange = (
        _e: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

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
            {data?.invoices && (
                <InvoicesTable
                    invoices={data.invoices}
                    isFetching={isFetching}
                    isSuccess={isSuccess}
                    limit={limit}
                    page={page}
                />
            )}
        </div>
    );
}
