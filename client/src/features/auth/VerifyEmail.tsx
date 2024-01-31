import s from "../../styles/Auth.module.scss";
import { useParams } from "react-router-dom";
import { useVerifyEmailQuery } from "./authApiSlice";
import { useGetErrorMessage } from "../../hooks/useGetErrorMessage";
import { CircularProgress } from "@mui/material";

export default function VerifyEmail() {
    const { emailToken } = useParams<{ emailToken: string }>();
    const { error, isLoading, data, isError } = useVerifyEmailQuery({
        emailToken,
    });
    const errorMsg = useGetErrorMessage(error, null);

    const content = isError ? errorMsg : data?.message + " Go to login";

    return (
        <div className={s.VerifyEmail}>
            <h1>Email verification</h1>
            {isLoading ? <CircularProgress /> : <p>{content}</p>}
        </div>
    );
}
