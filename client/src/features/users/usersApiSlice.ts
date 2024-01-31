import { apiSlice } from "../../app/api/apiSlice";
import { RolesType } from "../../hooks/useAuth";

export interface User {
    _id: string;
    firstName: string,
    lastName: string,
    country: string,
    email: string,
    phone: string,
    password: string,
    roles: RolesType[],
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date
}

export type UserProfile = Omit<User, "password" | "_id">
export type Users = Omit<User, "password" | "email">
export type UserSingle = Omit<User, "password">

interface GetUsersRes {
    users: Users[]
    usersArrayLength: number;
}

interface GetProfileResponse {
    profile: UserProfile
}

interface GetUserRes {
    user: UserSingle;
}

const rootPath = "/user";

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<GetUsersRes, { limit?: number, page?: number }>({
            query: ({ limit, page }) => `${rootPath}/all-users?limit=${limit}&page=${page}`,
            providesTags: (result) => {
                if(result?.users) {
                    return [
                        { type: "User", id: "LIST" },
                        ...result.users.map(({ _id }) => ({ type: "User" as const, id: _id}))
                    ]
                }
                else return [{ type: "User", id: "LIST" }]
            }
        }),
        getProfile: build.query<GetProfileResponse, void>({
            query: () => `${rootPath}/profile`
        }),
        getUser: build.query<GetUserRes, { userId: string }>({
            query: ({ userId }) => `${rootPath}/single-user?userId=${userId}`,
            providesTags: (result) => {
                if(result?.user) {
                    return [{ type: "User" as const, id: result.user._id }]
                }
                else return [{ type: "User" as const, id: "LIST" }];
            }
        })
    })
})

export const {
    useLazyGetUsersQuery,
    useGetProfileQuery,
    useLazyGetUserQuery,
} = usersApiSlice;