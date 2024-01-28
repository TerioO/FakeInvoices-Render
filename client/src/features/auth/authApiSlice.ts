import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "../../app/store";
import { setCredentials, logout } from "./authSlice";
import { setPersistLogin } from "./authSlice";

export interface LoginPayload {
    email: string;
    password: string
}

export interface LoginResponse {
    accessToken: string;
}

export interface RegisterPayload {
    firstName: string,
    lastName: string,
    country: string,
    email: string,
    phone: string,
    password: string,
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<LoginResponse, LoginPayload>({
            query: (payload) => ({
                url: "/auth/login",
                method: "POST",
                body: payload
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }){
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                }
                catch(error){
                    //
                }
            }
        }),
        register: build.mutation<{ message: string }, RegisterPayload>({
            query: (payload) => ({
                url: "/auth/register",
                method: "POST",
                body: payload
            })
        }),
        refresh: build.query<{ accessToken: string }, void>({
            query: () => "/auth/refresh",
            async onQueryStarted(_arg, { dispatch, queryFulfilled }){
                try {
                    const response = await queryFulfilled;
                    dispatch(setCredentials(response.data));
                }
                catch(error){
                    dispatch(setPersistLogin(false));
                }
            }
        }),
        logout: build.query<{ message: string }, void>({
            query: () => "/auth/logout",
            async onQueryStarted(_arg, { dispatch, queryFulfilled }){
                try {
                    await queryFulfilled;
                    dispatch(setPersistLogin(false));
                    dispatch(logout());
                    dispatch(apiSlice.util.resetApiState());
                }
                catch(error){
                    //
                }
            }
        })
    })
})

export const selectIsUninitializedRefreshToken = (state: RootState) => authApiSlice.endpoints.refresh.select()(state).isUninitialized;
export const selectIsUninitializedLogout = (state: RootState) => authApiSlice.endpoints.logout.select()(state).isUninitialized;
export const selectIsSuccessLogout = (state: RootState) => authApiSlice.endpoints.logout.select()(state).isSuccess;

export const {
    useLoginMutation,
    useRegisterMutation,
    useLazyLogoutQuery,
    useLazyRefreshQuery
} = authApiSlice;