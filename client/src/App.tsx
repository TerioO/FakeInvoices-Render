import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import _404 from "./404";
import Welcome from "./components/Pages/Welcome";
import UsersList from "./features/users/UsersList";
import RequireAuth from "./features/auth/RequireAuth";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import PersistLogin from "./features/auth/PersistLogin";
import Profile from "./features/users/Profile";
import AccountSettings from "./features/users/AccountSettings";
import PageContainer from "./components/Layout/PageContainer";
import InvoicesList from "./features/invoices/InvoicesList";
import MyInvoices from "./features/invoices/MyInvoices";
import SingleInvoice from "./features/invoices/SingleInvoice";
import VerifyEmail from "./features/auth/VerifyEmail";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/verify/:emailToken" element={<VerifyEmail />}></Route>

                <Route element={<PageContainer />}>
                    <Route element={<PersistLogin />}>
                        <Route index element={<Welcome />}></Route>
                        <Route element={<RequireAuth roles={["USER", "ADMIN", "OWNER"]}/>}>
                            <Route path="/profile" element={<Profile />}></Route>
                            <Route path="/settings" element={<AccountSettings />}></Route>
                            <Route path="/my-invoices" element={<MyInvoices />}></Route>
                            <Route path="/single-invoice/:userId/:invoiceId" element={<SingleInvoice />}></Route>
                        </Route>
                        <Route element={<RequireAuth roles={["ADMIN", "OWNER"]}/>}>
                            <Route path="/users" element={<UsersList />}></Route>
                            <Route path="/invoices" element={<InvoicesList />}></Route>
                        </Route>
                    </Route>
                    
                    <Route path="*" element={<_404 />}></Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
