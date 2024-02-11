import s from "../../styles/Layout.module.scss";
import { Outlet } from "react-router-dom";
import { useGetCheckServerOnQuery } from "../../app/api/apiSlice";
import { CircularProgress } from "@mui/material";

export default function CheckServerOn() {
    const { isLoading, isSuccess, isError } = useGetCheckServerOnQuery();

    let content;
    if (isLoading)
        content = (
            <div className={s.serverLoading}>
                <h1>Checking server connection</h1>
                <p>
                    Server enters "sleep mode" when not in use, it should take
                    about 1 minute to start.
                </p>
                <p>
                    This page is used to prevent interaction, otherwise all
                    request seem unresponsive.
                </p>
                <CircularProgress />
            </div>
        );
    else if (isError)
        content = (
            <div className={s.serverError}>
                <h1>Server not responding</h1>
                <p>Try again later.</p>
            </div>
        );
    else if (isSuccess) content = <Outlet />;
    return content;
}
