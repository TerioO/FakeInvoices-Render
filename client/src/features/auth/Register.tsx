import s from "../../styles/Auth.module.scss";
import React, { useEffect, useState } from "react";
import {
    useRegisterMutation,
    useLoginMutation,
    RegisterPayload,
} from "./authApiSlice";
import { useAppDispatch } from "../../app/hooks";
import { setGLobalSnackbarMessage } from "../../app/slices/globalSnackbarSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useGetErrorMessage } from "../../hooks/useGetErrorMessage";
import PasswordInput from "../../components/utils/PasswordInput";
import TextInput from "../../components/utils/TextInput";
import { Button, LinearProgress, Autocomplete, TextField } from "@mui/material";
import { COUNTRIES } from "../../constants/countries";

const initialFormState: RegisterPayload = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: COUNTRIES[180],
    phone: "",
};

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [form, setForm] = useState<RegisterPayload>(initialFormState);
    const [register, { isLoading: isRegisterLoading, error: registerError, isSuccess: isRegisterSuccess }] =
        useRegisterMutation();
    const [login, { isLoading: isLoginLoading, isError: isLoginError, error: errorLogin, isSucess: isLoginSuccess }] =
        useLoginMutation();

    const errorMsg = useGetErrorMessage(registerError, form);
    const loginErrorMsg = useGetErrorMessage(errorLogin, null);

    const handleFormUpdate = (
        e: React.ChangeEvent<HTMLInputElement>,
        property: keyof RegisterPayload
    ) => {
        if (property === "firstName" || property === "lastName")
            setForm((prev) => {
                return {
                    ...prev,
                    [property]:
                        e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1),
                };
            });
        else setForm((prev) => ({ ...prev, [property]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await register(form).unwrap();
            await login(form).unwrap();
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        if(isLoginError) {
            dispatch(setGLobalSnackbarMessage(loginErrorMsg || "Login: unknown error"));
            navigate("/login");
        }
        else if(isLoginSuccess && isRegisterSuccess) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoginError, isRegisterSuccess, isLoginSuccess])

    return (
        <div className={s.Register}>
            <form onSubmit={handleSubmit}>
                <h1>REGISTER</h1>
                <TextInput
                    label="First Name"
                    required
                    value={form.firstName}
                    onChange={(e) => handleFormUpdate(e, "firstName")}
                />
                <TextInput
                    label="Last Name"
                    required
                    value={form.lastName}
                    onChange={(e) => handleFormUpdate(e, "lastName")}
                />
                <TextInput
                    label="Email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleFormUpdate(e, "email")}
                />
                <PasswordInput
                    value={form.password}
                    onChange={(e) => handleFormUpdate(e, "password")}
                />
                <Autocomplete
                    options={COUNTRIES}
                    renderInput={(country) => (
                        <TextField
                            {...country}
                            size="small"
                            margin="normal"
                            label="Country"
                        />
                    )}
                    value={form.country}
                    onChange={(_e, value) =>
                        setForm((prev) => ({
                            ...prev,
                            country: value as string,
                        }))
                    }
                />
                <TextInput
                    label="Phone"
                    required
                    value={form.phone}
                    onChange={(e) => handleFormUpdate(e, "phone")}
                />
                <p>{errorMsg}</p>
                <Button
                    disabled={isRegisterLoading || isLoginLoading}
                    type="submit"
                    variant="contained"
                >
                    REGISTER
                </Button>
                <p>
                    Already own an account?{" "}
                    <NavLink to="/login">Login here</NavLink>
                </p>
                {isRegisterLoading ||
                    (isLoginLoading && (
                        <div className={s.LinearProgress}>
                            <LinearProgress />
                        </div>
                    ))}
            </form>
        </div>
    );
}
