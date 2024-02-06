import s from "../../styles/Invoices.module.scss";
import { useEffect } from "react";
import { useLazyGetMyInvoicesQuery } from "./invoiceApiSlice";
import CircularProgressCenter from "../../components/utils/CircularProgressCenter";
import CustomSnackbar from "../../components/utils/CustomSnackbar";
import InvoicesTable from "./InvoicesTable";

export default function MyInvoices() {
    const [getMyInvoices, { isLoading, isSuccess, isFetching, error, data }] =
        useLazyGetMyInvoicesQuery();

    useEffect(() => {
        if (!isLoading) getMyInvoices(undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={s.MyInvoices}>
            <h1>My Invoices</h1>
            <p>Click on row to open details.</p>
            <CustomSnackbar message={error} />
            {isLoading && <CircularProgressCenter />}
            {data?.invoices && (
                <InvoicesTable
                    invoices={data.invoices}
                    isFetching={isFetching}
                    isSuccess={isSuccess}
                    limit={0}
                    page={0}
                />
            )}
        </div>
    );
}