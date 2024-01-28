import { Outlet } from "react-router-dom";
import s from "../../styles/Layout.module.scss";

export default function PageContainer() {
    return (
        <main className={s.PageContainer}>
            <div>
                <Outlet />
            </div>
        </main>
    );
}
