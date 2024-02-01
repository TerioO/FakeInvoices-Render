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
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const initialLoginState: LoginPayload = {
    email: "",
    password: "",
};

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginPayload>(initialLoginState);
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

    const handleCheckboxClick = () => {
        
    }

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
                    onClick={handleCheckboxClick}
                    control={
                        <Checkbox
                            checked={persistLogin}
                            onChange={(e) => {
                                dispatch(setPersistLogin(e.target.checked));
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
        </div>
    );
}
