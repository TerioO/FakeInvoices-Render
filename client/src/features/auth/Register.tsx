import s from "../../styles/Auth.module.scss";
import React, { useEffect } from "react";
import {
    useRegisterMutation,
    useLoginMutation,
    RegisterPayload,
} from "./authApiSlice";
import {
    setRegisterForm,
    selectRegisterForm,
    resetRegisterForm,
} from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setGLobalSnackbarMessage } from "../../app/slices/globalSnackbarSlice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useGetErrorMessage } from "../../hooks/useGetErrorMessage";
import PasswordInput from "../../components/utils/PasswordInput";
import TextInput from "../../components/utils/TextInput";
import { Button, LinearProgress, Autocomplete, TextField } from "@mui/material";
import { COUNTRIES } from "../../constants/countries";
import PasswordErrorMessages from "../../components/utils/PasswordErrorMessages";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const form = useAppSelector(selectRegisterForm);
    const [
        register,
        {
            isLoading: isRegisterLoading,
            error: registerError,
            isSuccess: isRegisterSuccess,
            isError: isRegisterError,
        },
    ] = useRegisterMutation();
    const [
        login,
        {
            isLoading: isLoginLoading,
            isError: isLoginError,
            error: errorLogin,
            isSuccess: isLoginSuccess,
        },
    ] = useLoginMutation();

    const errorMsg = useGetErrorMessage(registerError, form);
    const loginErrorMsg = useGetErrorMessage(errorLogin, null);

    const handleFormUpdate = (
        e: React.ChangeEvent<HTMLInputElement>,
        property: keyof RegisterPayload
    ) => {
        dispatch(setRegisterForm({ value: e.target.value, property }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await register(form);
            await login(form);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        if (isRegisterError) {
            // Do nothing, don't navigate away
        } else if (isLoginError) {
            dispatch(
                setGLobalSnackbarMessage(
                    loginErrorMsg || "Login: unknown error"
                )
            );
            dispatch(resetRegisterForm({ keepLoginData: true }));
            navigate("/login");
        } else if (isLoginSuccess && isRegisterSuccess) {
            dispatch(resetRegisterForm({ keepLoginData: false }));
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoginError, isRegisterSuccess, isLoginSuccess]);

    return (
        <div className={s.Register}>
            <form onSubmit={handleSubmit}>
                <h1>REGISTER</h1>
                <TextInput
                    label="First Name"
                    required
                    error={form.errorFirstName}
                    value={form.firstName}
                    onChange={(e) => handleFormUpdate(e, "firstName")}
                />
                {form.errorFirstName && (
                    <p className={s.errorText}>
                        Minimum 2 characters from [a-Z]
                    </p>
                )}
                <TextInput
                    label="Last Name"
                    required
                    error={form.errorLastName}
                    value={form.lastName}
                    onChange={(e) => handleFormUpdate(e, "lastName")}
                />
                {form.errorLastName && (
                    <p className={s.errorText}>
                        Minimum 2 characters from [a-Z]
                    </p>
                )}
                <TextInput
                    label="Email"
                    type="email"
                    error={form.errorEmail}
                    required
                    value={form.email}
                    onChange={(e) => handleFormUpdate(e, "email")}
                />
                {form.errorEmail && (
                    <p className={s.errorText}>
                        Must be valid email, check allowed email domains in{" "}
                        <Link to="/about" target="_blank">
                            About
                        </Link>{" "}
                    </p>
                )}
                <PasswordInput
                    value={form.password}
                    error={form.errorPassword}
                    onChange={(e) => handleFormUpdate(e, "password")}
                />
                <PasswordErrorMessages
                    password={form.password}
                    shouldDisplay={form.errorPassword}
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
                        dispatch(
                            setRegisterForm({
                                value: value as string,
                                property: "country",
                            })
                        )
                    }
                />
                <TextInput
                    label="Phone"
                    required
                    value={form.phone}
                    onChange={(e) => handleFormUpdate(e, "phone")}
                />
                {form.errorPhone && (
                    <p className={s.errorText}>Must contain 10 digits</p>
                )}
                <p className="errorTRUE">{errorMsg}</p>
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
