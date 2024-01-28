import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GlobalSnackbarSlice {
    message: string
}

const initialState: GlobalSnackbarSlice = {
    message: ""
}

const globalSnackbarSlice = createSlice({
    name: "globalSnackbar",
    initialState,
    reducers: {
        close: (state) => {
            state.message = "";
        },
        setGLobalSnackbarMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        }
    }
});

export const selectGlobalSnackbarMessage = (state: RootState) => state.globalSnackbar.message;
export const { close, setGLobalSnackbarMessage } = globalSnackbarSlice.actions
export default globalSnackbarSlice.reducer