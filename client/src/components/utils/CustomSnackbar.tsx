import { useEffect, useState } from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
    message: SerializedError | FetchBaseQueryError | undefined | string;
};

export default function CustomSnackbar({ message }: Props) {
    let msg: string | undefined = "";
    const [open, setOpen] = useState<boolean>(false);
    if (message) {
        if (typeof message === "string") {
            msg = message;
        } else if ("status" in message) {
            if ("error" in message) {
                // msg = message.error;
                msg = "";
            } else {
                const res = message.data as {
                    message: string;
                    isError: boolean;
                };
                msg = res.message;
            }
        } else {
            // msg = message.message;
            msg = "";
        }
    }

    useEffect(() => {
        setOpen(Boolean(msg));
    }, [msg]);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={5000}
            open={open}
            onClose={handleClose}
        >
            <SnackbarContent
                message={msg}
                style={{ background: "white", color: "black" }}
                action={
                    <IconButton size="small" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                }
            ></SnackbarContent>
        </Snackbar>
    );
}
