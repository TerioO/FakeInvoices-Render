import s from "../../styles/Layout.module.scss";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Menu,
    MenuItem,
    Tooltip,
    IconButton,
    Avatar,
    Divider,
    ListItemIcon,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import Logout from "../../features/auth/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";

export default function AvatarMenu() {
    const user = useAuth();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={s.AvatarMenu}>
            <Tooltip title="Account">
                <IconButton onClick={handleClick}>
                    <Avatar>{user.firstName ? user.firstName[0] : "?"}</Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                className={s.AvatarMenu}
            >
                {user.status === "LOGGED IN" ? (
                    <NavLink to="/profile" onClick={handleClose}>
                        <MenuItem>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                    </NavLink>
                ) : null}
                {user.status === "LOGGED IN" ? (
                    <NavLink to="/settings" onClick={handleClose}>
                        <MenuItem>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            Account Settings
                        </MenuItem>
                    </NavLink>
                ) : null}
                {user.status === "LOGGED IN" ? <Divider /> : null}
                {user.status === "NOT LOGGED" ? (
                    <NavLink to="/login" onClick={handleClose}>
                        <MenuItem>
                            <ListItemIcon>
                                <LoginIcon />
                            </ListItemIcon>
                            Login
                        </MenuItem>
                    </NavLink>
                ) : null}
                <NavLink to="/register" onClick={handleClose}>
                    <MenuItem>
                        <ListItemIcon>
                            <PersonAddAlt1Icon />
                        </ListItemIcon>
                        Register
                    </MenuItem>
                </NavLink>
                {user.status === "LOGGED IN" ? <Logout handleClose={handleClose}/> : null}
            </Menu>
        </div>
    );
}
