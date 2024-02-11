import s from "../../../styles/Requests.module.scss";
import { UserRequestI } from "./requestsApiSlice";
import { Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

type Props = {
    type: "OWNER" | "!OWNER";
    request: UserRequestI;
    handleDeleteRequest?: () => void;
    handleUpdateRequestStatus?: () => void;
};

export default function RequestCard({
    type,
    request,
    handleDeleteRequest,
    handleUpdateRequestStatus,
}: Props) {
    return (
        <Paper className={s.RequestCard} elevation={3}>
            <div className={s.title}>
                <p>
                    <span>UserID - </span>
                    {request.userId}
                </p>
                {type === "!OWNER" && (
                    <span>
                        <IconButton onClick={handleDeleteRequest}>
                            <DeleteIcon />
                        </IconButton>
                    </span>
                )}
            </div>
            <p className={s.message}>{request.message}</p>
            <div className={s.date}>
                <p>{dayjs(request.createdAt).format("DD-MMM-YYYY HH:mm")}</p>
                <p
                    className={
                        request.fulfilled == "PENDING"
                            ? s.pending
                            : request.fulfilled === "FULFILLED"
                            ? s.fulfilled
                            : s.rejected
                    }
                >
                    {type === "OWNER" ? (
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={handleUpdateRequestStatus}
                        >
                            {request.fulfilled}
                        </span>
                    ) : (
                        request.fulfilled
                    )}
                </p>
            </div>
        </Paper>
    );
}
