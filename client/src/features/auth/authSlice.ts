import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

let initValue = false;
if (!localStorage.persistLogin) {
    localStorage.persistLogin = "false";
}
else if (localStorage.persistLogin === "true") {
    initValue = true;
}

interface AuthState {
    token: string | null;
    persistLogin: boolean;
    hasLoggedOut: boolean;
}

const initialState: AuthState = {
    token: null,
    persistLogin: initValue,
    hasLoggedOut: false
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
        }
    }
});

export const { setCredentials, logout, setPersistLogin, setHasLoggedOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectPersistLogin = (state: RootState) => state.auth.persistLogin;
export const selectHasLoggedOut = (state: RootState) => state.auth.hasLoggedOut;