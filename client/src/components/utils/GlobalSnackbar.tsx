import {
    selectGlobalSnackbarMessage,
    close,
} from "../../app/slices/globalSnackbarSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function GlobalSnackbar() {
    const dispatch = useAppDispatch();
    const message = useAppSelector(selectGlobalSnackbarMessage);

    const handleClose = () => {
        dispatch(close());
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={5000}
            open={message ? true : false}
            onClose={handleClose}
        >
            <SnackbarContent
                message={message}
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
