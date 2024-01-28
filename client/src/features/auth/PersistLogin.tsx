import s from "../../styles/Auth.module.scss";
import { useEffect } from "react";
import { useLazyRefreshQuery } from "./authApiSlice";
import { Outlet } from "react-router-dom";
import { selectCurrentToken, selectPersistLogin } from "./authSlice";
import { useAppSelector } from "../../app/hooks";
import { LinearProgress } from "@mui/material";
import CustomSnackbar from "../../components/utils/CustomSnackbar";

export default function PersistLogin() {
    const token = useAppSelector(selectCurrentToken);
    const persistLogin = useAppSelector(selectPersistLogin);

    const [refresh, { isLoading, error, isError, isSuccess, isUninitialized }] =
        useLazyRefreshQuery();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                //
            }
        };
        if (!token && persistLogin) verifyRefreshToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Why these checks? Only return Outlet when the token was set, otherwise RequireAuth will have token=null and
    // redirect to /login
    let content;
    if (!persistLogin) {
        content = <Outlet />;
    } else if (isSuccess) {
        content = <Outlet />;
    } else if (token && isUninitialized) {
        content = <Outlet />;
    }

    return (
        <>
            {isError && <CustomSnackbar message={error} />}
            {isLoading && (
                <div className={s.PersistLoginLoading}>
                    <LinearProgress />{" "}
                </div>
            )}
            {content}
        </>
    );
}
