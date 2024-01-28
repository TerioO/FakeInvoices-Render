import { useLazyLogoutQuery } from "./authApiSlice";
import { useNavigate } from "react-router-dom";
import { CircularProgress, MenuItem, ListItemIcon } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

type Props = {
    handleClose: () => void;
}

export default function Logout({ handleClose }: Props) {
    const navigate = useNavigate();
    const [logoutRequest, { isLoading }] = useLazyLogoutQuery();

    const handleLogout = async () => {
        try {
            await logoutRequest().unwrap();
            handleClose();
            navigate("/");
        } catch (error) {
            //
        }
    };

    return (
        <MenuItem
            onClick={() => {
                if (!isLoading) handleLogout();
            }}
        >
            <ListItemIcon>
                <LogoutIcon />
            </ListItemIcon>
            <span
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {isLoading ? <CircularProgress size="1rem" /> : "Logout"}
            </span>
        </MenuItem>
    );
}
