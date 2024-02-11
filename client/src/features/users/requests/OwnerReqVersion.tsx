import s from "../../../styles/Requests.module.scss";
import React, { useState } from "react";
import {
    FulfilledValues,
    SortValues,
    UpdateRequestPayload,
    useGetRequestsQuery,
    useUpdateRequestMutation,
} from "./requestsApiSlice";
import { CircularProgress, Divider, Pagination, Modal } from "@mui/material";
import CustomSnackbar from "../../../components/utils/CustomSnackbar";
import { SelectSortRequests, SelectFulfilledRequests } from "./Selects";
import RequestCard from "./RequestCard";

export default function OwnerReqVersion() {
    const limit = 20;
    const [page, setPage] = useState<number>(1);
    const [sort, setSort] = useState<SortValues>("N/A");
    const [fulfilled, setFulfilled] = useState<FulfilledValues>("N/A");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const { isFetching, isSuccess, data, error } = useGetRequestsQuery({
        limit,
        page,
        sort,
        fulfilled,
    });

    const [updatePayload, setUpdatePayload] = useState<UpdateRequestPayload>({
        requestId: "",
        fulfilled: "PENDING",
    });
    const [
        updateRequest,
        { error: errorUpdate, data: dataUpdate, isLoading: isLoadingUpdate },
    ] = useUpdateRequestMutation();

    const pages = data ? Math.ceil(data?.count / limit) : 1;
    const handlePageChange = (
        _e: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    const handleUpdateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updateRequest(updatePayload);
        setModalOpen(false);
    };

    let content;
    if (isSuccess) {
        content = data.userRequests.map((el) => (
            <RequestCard
                key={el._id}
                request={el}
                type="OWNER"
                handleUpdateRequestStatus={() => {
                    setModalOpen(true);
                    setUpdatePayload((prev) => ({
                        ...prev,
                        requestId: el._id,
                        fulfilled: el.fulfilled,
                    }));
                }}
            />
        ));
    }

    return (
        <div className={s.OwnerReqVersion}>
            <p style={{ textAlign: "center" }}>{data?.count} - Requests</p>
            <div className={s.controls}>
                <SelectFulfilledRequests
                    className={s.selFulfilled}
                    fulfilled={fulfilled}
                    setFulfilled={setFulfilled}
                />
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
                {isFetching ? (
                    <CircularProgress sx={{ marginTop: "1rem" }} />
                ) : (
                    content
                )}
            </div>
            <CustomSnackbar message={error} />
            <CustomSnackbar message={errorUpdate} />
            <CustomSnackbar message={dataUpdate?.message} />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className={s.updateModal}>
                    <form onSubmit={handleUpdateRequest}>
                        <select
                            value={updatePayload.fulfilled}
                            onChange={(e) =>
                                setUpdatePayload((prev) => ({
                                    ...prev,
                                    fulfilled: e.target
                                        .value as FulfilledValues,
                                }))
                            }
                        >
                            <option value="FULFILLED">FULFILLED</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="PENDING">PENDING</option>
                        </select>
                        <button type="submit" disabled={isLoadingUpdate}>
                            UPDATE
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
