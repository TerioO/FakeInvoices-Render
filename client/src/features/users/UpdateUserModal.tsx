import s from "../../styles/User.module.scss";
import React, { useState, useEffect } from "react";
import { Modal, IconButton, Divider } from "@mui/material";
import {
    UsersI,
    UpdateUserPayload,
    useUpdateUserMutation,
} from "./usersApiSlice";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { RoleType } from "../../hooks/useAuth";
import { useGetErrorMessage } from "../../hooks/useGetErrorMessage";
import { setGLobalSnackbarMessage } from "../../app/slices/globalSnackbarSlice";
import { useAppDispatch } from "../../app/hooks";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: UsersI | undefined;
};

const roles: RoleType[] = ["USER", "OWNER", "READER"];

export default function UpdateUserModal({ open, setOpen, user }: Props) {
    const dispatch = useAppDispatch();
    const [form, setForm] = useState<UpdateUserPayload>({
        userId: "",
        role: "USER",
        email: "",
        password: "",
    });

    useEffect(() => {
        setForm({
            userId: user?._id || "",
            role: user?.role || "USER",
            email: user?.email || "",
            password: "",
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, setOpen]);

    const [updateUser, { isLoading, data, isSuccess, error, isError }] =
        useUpdateUserMutation();

    const closeModal = () => setOpen(false);
    const errorMsg = useGetErrorMessage(error, null);

    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updateUser(form);
    };

    useEffect(() => {
        if (isSuccess) {
            closeModal();
            dispatch(setGLobalSnackbarMessage(data?.message || "User updated!"));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    return (
        <Modal open={open} onClose={closeModal}>
            <div className={s.UpdateUserModal}>
                <span>
                    <IconButton onClick={closeModal}>
                        <CloseIcon />
                    </IconButton>
                </span>
                <form onSubmit={handleUpdateUser}>
                    <div className={s.userData}>
                        <p>ID: </p>
                        <p>{user?._id}</p>
                        <p>Last Name: </p>
                        <p>{user?.lastName}</p>
                        <p>First Name: </p>
                        <p>{user?.firstName}</p>
                        <p>Country: </p>
                        <p>{user?.country}</p>
                        <p>Phone: </p>
                        <p>{user?.phone}</p>
                        <p>Verified: </p>
                        <p>{user?.verification.isVerified ? "YES" : "NO"}</p>
                        <p>ROLE: </p>
                        <p>{user?.role}</p>
                        <p>EMAIL: </p>
                        <p>{user?.email}</p>
                        <p>Created: </p>
                        <p>
                            {dayjs(user?.createdAt).format("DD-MMM-YYYY HH:mm")}
                        </p>
                        <p>Updated: </p>
                        <p>
                            {dayjs(user?.updatedAt).format("DD-MMM-YYYY HH:mm")}
                        </p>
                    </div>
                    <Divider />
                    <div className={s.inputs}>
                        <label htmlFor="role">ROLE</label>
                        <select
                            name="role"
                            id="role"
                            value={form.role}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    role: e.target.value as RoleType,
                                }))
                            }
                        >
                            {roles.map((el) => (
                                <option key={el} value={el}>
                                    {el}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="emai">EMAIL</label>
                        <input
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                        />
                        <label htmlFor="password">PASSWORD</label>
                        <input
                            type="text"
                            id="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                        />
                    </div>
                    {isError && <p className="errorTRUE">{errorMsg}</p>}
                    <button type="submit" disabled={isLoading}>
                        UPDATE
                    </button>
                </form>
            </div>
        </Modal>
    );
}
