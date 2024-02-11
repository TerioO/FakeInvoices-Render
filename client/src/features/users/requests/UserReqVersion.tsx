import React from "react";
import s from "../../../styles/Requests.module.scss";
import { useState } from "react";
import {
    useCreateUserRequestMutation,
    useGetMyRequestsQuery,
    useDeleteRequestMutation,
    SortValues,
} from "./requestsApiSlice";
import {
    Button,
    TextField,
    Divider,
    Pagination,
    CircularProgress,
} from "@mui/material";
import CustomSnackbar from "../../../components/utils/CustomSnackbar";
import { SelectSortRequests } from "./Selects";
import RequestCard from "./RequestCard";

export default function UserReqVersion() {
    const limit = 20;
    const [page, setPage] = useState<number>(1);
    const [message, setMessage] = useState<string>("");
    const [sort, setSort] = useState<SortValues>("-createdAt");
    const [
        createUserRequest,
        { isLoading: isLoadingCreate, error: errorCreate, data: dataCreate },
    ] = useCreateUserRequestMutation();

    const {
        isSuccess: isSuccessGet,
        isFetching: isFetchingGet,
        data: dataGet,
    } = useGetMyRequestsQuery({ page, limit, sort });

    const [
        deleteRequest,
        { isLoading: isLoadingDelete, error: errorDelete, data: dataDelete },
    ] = useDeleteRequestMutation();

    const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createUserRequest({ message });
    };

    const handleDeleteRequest = async (requestId: string) => {
        if (!isLoadingDelete) await deleteRequest({ requestId });
    };

    const pages = dataGet ? Math.ceil(dataGet?.count / limit) : 1;
    const handlePageChange = (
        _e: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    let content;
    if (isSuccessGet) {
        content = dataGet.myRequests.map((el) => (
            <RequestCard
                key={el._id}
                request={el}
                type="!OWNER"
                handleDeleteRequest={() => handleDeleteRequest(el._id)}
            />
        ));
    }

    return (
        <div className={s.UserRerVersion}>
            <p className={s["info-title"]}>
                Send a message request to the owner to for example ask a
                different user role.
            </p>
            <form onSubmit={handleCreateRequest}>
                <TextField
                    label="Message"
                    placeholder="Less than 200 characters"
                    size="small"
                    multiline
                    value={message}
                    helperText={message.length > 200 ? "Message too long" : ""}
                    error={message.length > 200}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoadingCreate}
                >
                    {isLoadingCreate ? "LOADING..." : "Make Request"}
                </Button>
                <CustomSnackbar message={errorCreate} />
                <CustomSnackbar message={dataCreate?.message} />
                <CustomSnackbar message={errorDelete} />
                <CustomSnackbar message={dataDelete?.message} />
            </form>
            <div className={s.controls}>
                <SelectSortRequests
                    sort={sort}
                    setSort={setSort}
                    className={s.selSort}
                />
            </div>
            <Divider />
            <Pagination
                    className={s.pagination}
                    size="small"
                    color="primary"
                    page={page}
                    count={pages}
                    onChange={handlePageChange}
                />
            <div className={s.RequestsContainer}>
                {isFetchingGet ? (
                    <CircularProgress sx={{ marginTop: "1rem" }} />
                ) : (
                    content
                )}
            </div>
        </div>
    );
}
