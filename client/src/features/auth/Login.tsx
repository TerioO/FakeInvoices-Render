import s from "../../styles/Auth.module.scss";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation, LoginPayload } from "./authApiSlice";
import { useGetErrorMessage } from "../../hooks/useGetErrorMessage";
import { setPersistLogin, selectPersistLogin } from "./authSlice";
import PasswordInput from "../../components/utils/PasswordInput";
import TextInput from "../../components/utils/TextInput";
import {
    Button,
    FormControlLabel,
    Checkbox,
    LinearProgress,
    Modal,
    IconButton,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CloseIcon from "@mui/icons-material/Close";

const initialLoginState: LoginPayload = {
    email: "",
    password: "",
};

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginPayload>(initialLoginState);
    const [open, setOpen] = useState<boolean>(false);
    const persistLogin = useAppSelector(selectPersistLogin);
    const dispatch = useAppDispatch();
    const [login, { isLoading, error }] = useLoginMutation();

    const errorMsg = useGetErrorMessage(error, form);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(form).unwrap();
            setForm(initialLoginState);
            navigate("/");
        } catch (error) {
            /* */
        }
    };

    return (
        <div className={s.Login}>
            <form onSubmit={handleSubmit}>
                <h1>LOGIN</h1>
                <TextInput
                    label="Email"
                    type="email"
                    required={true}
                    value={form.email}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    }
                />
                <PasswordInput
                    value={form.password}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                        }))
                    }
                />
                <FormControlLabel
                    label="Remember me?"
                    sx={{ marginTop: ".5rem" }}
                    control={
                        <Checkbox
                            checked={persistLogin}
                            onChange={(e) => {
                                dispatch(setPersistLogin(e.target.checked));
                                if (e.target.checked) setOpen(true);
                            }}
                        />
                    }
                />
                <p>{errorMsg}</p>
                <Button disabled={isLoading} variant="contained" type="submit">
                    LOG IN
                </Button>
                <p>
                    Not registered yet?{" "}
                    <NavLink to="/register">Create an account</NavLink>
                </p>
                {isLoading && (
                    <div className={s.LinearProgress}>
                        <LinearProgress />
                    </div>
                )}
            </form>
            {import.meta.env.PROD && (
                <Modal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                    }}
                >
                    <div className="modal-container">
                        <div className="modal-content">
                            <span>
                                <IconButton
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </span>
                            <p>
                                To enable this function, 3rd party cookies must
                                be enabled from your browser.
                            </p>
                            <p>
                                Otherwise you will lose login session on every
                                page reload or new tab.
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
