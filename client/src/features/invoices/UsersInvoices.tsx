import s from "../../styles/Invoices.module.scss";
import InvoicesTable from "./InvoicesTable";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../users/usersApiSlice";
import { useGetUsersInvoicesQuery } from "./invoiceApiSlice";
import CustomSnackbar from "../../components/utils/CustomSnackbar";
import { CircularProgress } from "@mui/material";
import CircularProgressCenter from "../../components/utils/CircularProgressCenter";
import React from "react";

export default function UsersInvoices() {
    const { userId } = useParams<{ userId: string }>();

    const {
        error: errorUser,
        data: dataUser,
        isLoading: isLoadingUser,
        isSuccess: isSuccessUser,
    } = useGetUserQuery({ userId });
    const {
        error: errorInvoices,
        data: dataInvoices,
        isLoading: isLoadingInvoices,
        isFetching,
        isSuccess: isSuccessInvoices,
    } = useGetUsersInvoicesQuery({ userId });

    let userContent;
    if (isSuccessUser) {
        const { user } = dataUser;
        userContent = (
            <>
                <h1>
                    {user.firstName} {user.lastName}'s Invoices
                </h1>
                <p>Click on row to open details.</p>
            </>
        );
    }

    return (
        <div className={s.UsersInvoices}>
            {isLoadingUser ? (
                <div style={CircularProgressStyles}>
                    <CircularProgress />{" "}
                </div>
            ) : (
                userContent
            )}
            <CustomSnackbar message={errorUser} />
            <CustomSnackbar message={errorInvoices} />
            {isLoadingInvoices && <CircularProgressCenter />}
            {dataInvoices?.invoices && (
                <InvoicesTable
                    invoices={dataInvoices.invoices}
                    isFetching={isFetching}
                    isSuccess={isSuccessInvoices}
                    limit={0}
                    page={0}
                />
            )}
        </div>
    );
}

const CircularProgressStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "2rem 0",
};
