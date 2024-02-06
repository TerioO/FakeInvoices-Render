import s from "../../styles/User.module.scss";
import { useState } from "react";
import { useGetProfileQuery } from "./usersApiSlice";
import dayjs from "dayjs";
import { Button, Modal } from "@mui/material";
import CustomSnackbar from "../../components/utils/CustomSnackbar";
import CircularProgressCenter from "../../components/utils/CircularProgressCenter";

export default function Profile() {
    const { error, data, isLoading } = useGetProfileQuery();
    const user = data?.profile;

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    let content;
    if (user) {
        content = (
            <>
                <h1>
                    {user.lastName} {user.firstName}
                </h1>
                <div className={s.GridDisplay}>
                    <p>Country: </p>
                    <p>{user.country}</p>
                    <p>Phone: </p>
                    <p>{user.phone}</p>
                    <p>User roles: </p>
                    <p>{user.role}</p>
                    <p>Created </p>
                    <p>{dayjs(user.createdAt).format("DD/MM/YYYY-HH:mm")}</p>
                    <p>Updated</p>
                    <p>{dayjs(user.updatedAt).format("DD/MM/YYYY-HH:mm")}</p>
                </div>
            </>
        );
    }
    return (
        <div className={s.Profile}>
            {isLoading && <CircularProgressCenter />}
            {content}
            <CustomSnackbar message={error} />
            <Button onClick={() => setModalOpen(true)}>Read my db entry</Button>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className={s.ProfileModal}>
                    {JSON.stringify(data?.profile, null, 2)}
                </div>
            </Modal>
        </div>
    );
}
