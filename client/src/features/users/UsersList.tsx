import s from "../../styles/User.module.scss";
import React, { useEffect, useState } from "react";
import { useLazyGetUsersQuery, UsersI } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import CircularProgressCenter from "../../components/utils/CircularProgressCenter";
import CustomSnackbar from "../../components/utils/CustomSnackbar";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Pagination,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import UpdateUserModal from "./UpdateUserModal";
import SearchUser from "./SearchUser";

const limit = 10;

export default function UsersList() {
    const navigate = useNavigate();
    const [getUsers, { isFetching, data, error, isSuccess }] =
        useLazyGetUsersQuery();
    const { role } = useAuth();
    const [page, setPage] = useState<number>(1);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [userModal, setUserModal] = useState<UsersI | undefined>(undefined);

    useEffect(() => {
        if (!isFetching) getUsers({ limit, page }, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const pages = data ? Math.ceil(data.usersArrayLength / limit) : 1;

    const handlePageChange = (
        _e: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    const navigateToUserInvoices = (userId: string) =>
        navigate(`/invoices/${userId}`);

    let content;
    if (isSuccess) {
        content = data?.users.map((user) => (
            <Accordion key={user._id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h3>
                        {user.lastName} {user.firstName}
                    </h3>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={s.UsersAccordionDetails}>
                        <p>Country: </p>
                        <p>{user.country}</p>
                        <p>Phone: </p>
                        <p>{user.phone}</p>
                        <p>User role:</p>
                        <p>{user.role}</p>
                        <p>Created: </p>
                        <p>
                            {dayjs(user.createdAt).format("DD/MM/YYYY-HH:mm")}
                        </p>
                        <p>Updated: </p>
                        <p>
                            {dayjs(user.updatedAt).format("DD/MM/YYYY-HH:mm")}
                        </p>
                    </div>
                    <div className={s.OpenUserInvoices}>
                        <Button
                            variant="outlined"
                            onClick={() => navigateToUserInvoices(user._id)}
                        >
                            Open user invoices
                        </Button>
                        {role === "OWNER" && (
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setUserModal(user);
                                    setOpenModal(true);
                                }}
                            >
                                Edit User
                            </Button>
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
        ));
    }

    return (
        <div className={s.UsersList}>
            <CustomSnackbar message={error} />
            {isFetching && <CircularProgressCenter />}
            <h1>Users list</h1>
            <SearchUser />
            <div className={s.UsersPagination}>
                <Pagination
                    size="small"
                    color="primary"
                    count={pages}
                    page={page}
                    onChange={handlePageChange}
                />
            </div>
            <div>{!isFetching && content}</div>
            <UpdateUserModal
                open={openModal}
                setOpen={setOpenModal}
                user={userModal}
            />
        </div>
    );
}
