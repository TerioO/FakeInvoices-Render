import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { RegisterPayload } from "./authApiSlice";
import { COUNTRIES } from "../../constants/countries";
import { NAME_REGEX, PASSWORD_REGEX, EMAIL_REGEX, PHONE_REGEX } from "../../constants/regex";
import { emailDomains } from "../../constants/emailDomains";

let initValue = false;
if (!localStorage.persistLogin) {
    localStorage.persistLogin = "false";
}
else if (localStorage.persistLogin === "true") {
    initValue = true;
}

interface RegisterForm extends RegisterPayload {
    errorFirstName: boolean;
    errorLastName: boolean;
    errorPassword: boolean;
    errorEmail: boolean;
    errorPhone: boolean;
}

interface AuthState {
    token: string | null;
    persistLogin: boolean;
    hasLoggedOut: boolean;
    registerForm: RegisterForm
}

const registerFormInitialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: COUNTRIES[180],
    phone: "",
    errorFirstName: false,
    errorLastName: false,
    errorPassword: false,
    errorEmail: false,
    errorPhone: false,
}

const initialState: AuthState = {
    token: null,
    persistLogin: initValue,
    hasLoggedOut: false,
    registerForm: registerFormInitialState,
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
            state.token = action.payload.accessToken;
        },
        logout: (state) => {
            state.token = null;
            state.persistLogin = false;
            localStorage.persistLogin = "false";
            state.hasLoggedOut = true;
        },
        setPersistLogin: (state, action: PayloadAction<boolean>) => {
            state.persistLogin = action.payload;
            state.persistLogin
                ? localStorage.persistLogin = "true"
                : localStorage.persistLogin = "false"
        },
        setHasLoggedOut: (state, action: PayloadAction<boolean>) => {
            state.hasLoggedOut = action.payload;
        },
        resetRegisterForm: (state, action: PayloadAction<{ keepLoginData?: boolean }>) => {
            if(action.payload.keepLoginData){
                state.registerForm = {
                    ...registerFormInitialState,
                    email: state.registerForm.email,
                    password: state.registerForm.password
                }
            }
            else state.registerForm = registerFormInitialState;
        },
        setRegisterForm: (state, action: PayloadAction<{ value: string, property: keyof RegisterPayload }>) => {
            const { property, value } = action.payload;
            let newValue = value;
            if (property === "firstName" || property === "lastName") {
                newValue = value.charAt(0).toUpperCase() +
                    value.slice(1)
            }
            if (property === "firstName") state.registerForm.errorFirstName = !NAME_REGEX.test(newValue);
            else if (property === "lastName") state.registerForm.errorLastName = !NAME_REGEX.test(newValue);
            else if (property === "email") state.registerForm.errorEmail = !EMAIL_REGEX.test(newValue) || !emailDomains.includes(newValue.split("@")[1]);
            else if (property === "password") state.registerForm.errorPassword = !PASSWORD_REGEX.test(newValue);
            else if (property === "phone") state.registerForm.errorPhone = !PHONE_REGEX.test(newValue);
            state.registerForm = { ...state.registerForm, [property]: newValue }

        }
    }
});

export const {
    setCredentials,
    logout,
    setPersistLogin,
    setHasLoggedOut,
    resetRegisterForm,
    setRegisterForm
} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectPersistLogin = (state: RootState) => state.auth.persistLogin;
export const selectHasLoggedOut = (state: RootState) => state.auth.hasLoggedOut;
export const selectRegisterForm = (state: RootState) => state.auth.registerForm;