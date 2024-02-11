import s from "../../styles/Auth.module.scss";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { useGetErrorMessage } from "../../hooks/useGetErrorMessage";
import {
    setPersistLogin,
    selectPersistLogin,
    selectRegisterForm,
    resetRegisterForm,
    setRegisterForm,
} from "./authSlice";
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

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const persistLogin = useAppSelector(selectPersistLogin);
    const form = useAppSelector(selectRegisterForm);
    const [open, setOpen] = useState<boolean>(false);
    const [login, { isLoading, error }] = useLoginMutation();

    const errorMsg = useGetErrorMessage(error, form);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(form).unwrap();
            dispatch(resetRegisterForm({ keepLoginData: false }));
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
                        dispatch(
                            setRegisterForm({
                                value: e.target.value,
                                property: "email",
                            })
                        )
                    }
                />
                <PasswordInput
                    value={form.password}
                    onChange={(e) =>
                        dispatch(
                            setRegisterForm({
                                value: e.target.value,
                                property: "password",
                            })
                        )
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
                <p className={s.rememberMeInfo}>Check this, otherwise login session is lost on every new tab/reload</p>
                <p className="errorTRUE">{errorMsg}</p>
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
