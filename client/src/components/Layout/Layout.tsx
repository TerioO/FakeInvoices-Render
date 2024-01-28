import s from "../../styles/Layout.module.scss";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import GlobalSnackbar from "../utils/GlobalSnackbar";

export default function Layout() {
    return (
        <div className={s.Layout}>
            <Header />
            <Outlet />
            <Footer />
            <GlobalSnackbar />
        </div>
    );
}
