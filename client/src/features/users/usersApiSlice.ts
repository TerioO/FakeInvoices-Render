import { apiSlice } from "../../app/api/apiSlice";
import { RoleType } from "../../hooks/useAuth";

export interface UserI {
    _id: string;
    firstName: string,
    lastName: string,
    country: string,
    email: string,
    phone: string,
    password: string,
    role: RoleType,
    verification: {
        isVerified: boolean;
        emailSentAt: Date;
    }
    createdAt: Date,
    updatedAt: Date
}

export type UsersI = Omit<UserI, "password">
export type UserSingleI = Omit<UserI, "password">

interface GetUsersRes {
    users: UsersI[]
    usersArrayLength: number;
}

interface GetProfileRes {
    profile: UserI;
}

interface GetUserRes {
    user: UserSingleI;
}

export interface UpdateUserPayload {
    userId: string | undefined,
    role: RoleType | undefined,
    password: string | undefined,
    email: string | undefined
}

export interface UpdateMyAccountPayload {
    newPassword: string,
    currentPassword: string
}

const rootPath = "/user";

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<GetUsersRes, { limit?: number, page?: number }>({
            query: ({ limit, page }) => `${rootPath}/all-users?limit=${limit}&page=${page}`,
            providesTags: (result) => {
                if (result?.users) {
                    return [
                        { type: "User", id: "LIST" },
                        ...result.users.map(({ _id }) => ({ type: "User" as const, id: _id }))
                    ]
                }
                else return [{ type: "User", id: "LIST" }]
            }
        }),
        getProfile: build.query<GetProfileRes, void>({
            query: () => `${rootPath}/profile`
        }),
        getUser: build.query<GetUserRes, { userId: string | undefined }>({
            query: ({ userId }) => `${rootPath}/single-user?userId=${userId}`,
            providesTags: (result) => {
                if (result?.user) {
                    return [{ type: "User" as const, id: result.user._id }]
                }
                else return [{ type: "User" as const, id: "LIST" }];
            }
        }),
        updateUser: build.mutation<{ message: string }, UpdateUserPayload>({
            query: (payload) => ({
                url: `${rootPath}/update-user`,
                method: "PATCH",
                body: payload
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "User" as const, id: arg.userId }]
        }),
        updateMyAccount: build.mutation<{ message: string }, UpdateMyAccountPayload>({
            query: (payload) => ({
                url: `${rootPath}/update-my-account`,
                method: "PATCH",
                body: payload
            })
        })
    })
})

export const {
    useLazyGetUsersQuery,
    useGetProfileQuery,
    useLazyGetUserQuery,
    useGetUserQuery,
    useUpdateMyAccountMutation,
    useUpdateUserMutation
} = usersApiSlice;