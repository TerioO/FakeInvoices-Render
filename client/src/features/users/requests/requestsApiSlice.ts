import { apiSlice } from "../../../app/api/apiSlice";

export type SortValues = ("createdAt" | "-createdAt" | "updatedAt" | "-updatedAt" | "N/A");
export type FulfilledValues = ("PENDING" | "FULFILLED" | "REJECTED" | "N/A");

export interface UserRequestI {
    _id: string;
    userId: string;
    message: string;
    fulfilled: FulfilledValues;
    createdAt: Date;
    updatedAt: Date;
}

type GetRequestsQuery = {
    limit?: number;
    page?: number;
    sort?: string;
    fulfilled?: FulfilledValues
}

export type UserRequestsSortOptions = {
    name: string,
    value: SortValues
}[]

type CreateUserReqRes = { message: string, userRequest: UserRequestI }
type GetRequestsRes = { userRequests: UserRequestI[], count: number };
type GetMyRequestsRes = { myRequests: UserRequestI[], count: number };
export type UpdateRequestPayload = { requestId: string; fulfilled: FulfilledValues }

const rootPath = "/user-requests";
const requestsApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        createUserRequest: build.mutation<CreateUserReqRes, { message: string }>({
            query: (payload) => ({
                url: `${rootPath}`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: (result) => {
                if (result?.userRequest._id) return [{ type: "U-Request" as const, id: "LIST" }]
                else return [{ type: "U-Request" as const, id: "N/A" }]
            }
        }),
        deleteRequest: build.mutation<{ message: string }, { requestId: string }>({
            query: (payload) => ({
                url: `${rootPath}`,
                method: "DELETE",
                body: payload
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "U-Request" as const, id: arg.requestId }]
        }),
        updateRequest: build.mutation<{ message: string }, UpdateRequestPayload>({
            query: (payload) =>  ({
                url: `${rootPath}`,
                method: "PATCH",
                body: payload
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "U-Request" as const, id: arg.requestId }]
        }),
        getRequests: build.query<GetRequestsRes, GetRequestsQuery>({
            query: (payload) => {
                const limit = payload.limit ?? 4;
                const page = payload.page ?? 1;
                const sort = payload.sort;
                const fulfilled = payload.fulfilled;
                return {
                    url: `${rootPath}/all-requests?limit=${limit}&page=${page}&sort=${sort}&fulfilled=${fulfilled}`
                }
            },
            providesTags: (result) => {
                const baseTag = { type: "U-Request" as const, id: "LIST" };
                if (result?.userRequests) {
                    return [
                        baseTag,
                        ...result.userRequests.map((el) => ({ type: "U-Request" as const, id: el._id }))
                    ]
                }
                return [baseTag]
            }
        }),
        getMyRequests: build.query<GetMyRequestsRes, GetRequestsQuery>({
            query: ({ page, limit, sort }) => `${rootPath}/my-requests?page=${page}&limit=${limit}&sort=${sort}`,
            providesTags: (result) => {
                const baseTag = { type: "U-Request" as const, id: "LIST" };
                if (result?.myRequests) {
                    return [
                        baseTag,
                        ...result.myRequests.map((el) => ({ type: "U-Request" as const, id: el._id }))
                    ]
                }
                return [baseTag]
            }
        })
    })
})

export const {
    useCreateUserRequestMutation,
    useDeleteRequestMutation,
    useUpdateRequestMutation,
    useGetMyRequestsQuery,
    useGetRequestsQuery,
    useLazyGetMyRequestsQuery,
    useLazyGetRequestsQuery
} = requestsApiSlice
