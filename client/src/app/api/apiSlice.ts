import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { setCredentials, logout } from '../../features/auth/authSlice';
import { setGLobalSnackbarMessage } from '../slices/globalSnackbarSlice';

let baseUrl = "";
let keepUnusedDataFor = 5;
if (import.meta.env.MODE === "development") {
    baseUrl = "http://localhost:3500";
    keepUnusedDataFor = 5;
}
else if (import.meta.env.MODE === "production") {
    baseUrl = import.meta.env.VITE_API_URL;
    keepUnusedDataFor = 60;
}

const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    console.log("baseQueryWithReauth ran!");
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && (result.error.status === 403 || result.error.status === 401)) {
        const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
        if (refreshResult?.data) {
            console.log("Fetching new access token.");
            api.dispatch(setCredentials(refreshResult.data as { accessToken: string }));
            result = await baseQuery(args, api, extraOptions);
        }
        else {
            console.log("Refresh token expired.");
            api.dispatch(logout());
            api.dispatch(setGLobalSnackbarMessage("Session expired, login required"))
        }
    }
    return result;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Invoice"],
    keepUnusedDataFor,
    endpoints: () => ({})
})