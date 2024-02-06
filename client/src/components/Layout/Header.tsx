import s from "../../styles/Layout.module.scss";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import AvatarMenu from "../utils/AvatarMenu";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton } from "@mui/material";

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const handleCloseDrawer = () => setDrawerOpen(false);

    const DrawerContent = (
        <div className={s.DrawerContent}>
            <span>
                <IconButton onClick={handleCloseDrawer}>
                    <CloseIcon />
                </IconButton>
            </span>
            <NavLink to="/" onClick={handleCloseDrawer}>
                HOME
            </NavLink>
            <NavLink to="/users" onClick={handleCloseDrawer}>
                USERS
            </NavLink>
            <NavLink to="/invoices" onClick={handleCloseDrawer}>
                INVOICES
            </NavLink>
            <NavLink to="/my-invoices" onClick={handleCloseDrawer}>
                MY INVOICES
            </NavLink>
        </div>
    );

    return (
        <header className={s.Header}>
            <div className={s.HeaderContent}>
                <span className={s.Burger}>
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            color: "white",
                            "&:hover": {
                                background: "#bdbdbd",
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </span>
                <NavLink to="/">HOME</NavLink>
                <NavLink to="/users">USERS</NavLink>
                <NavLink to="/invoices">INVOICES</NavLink>
                <NavLink to="/my-invoices">MY INVOICES</NavLink>
                <NavLink to="/about">ABOUT</NavLink>
                <AvatarMenu />
            </div>
            <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer}>
                {DrawerContent}
            </Drawer>
        </header>
    );
}
