import s from "../../styles/User.module.scss";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@mui/material";
import { useLazyGetUserQuery } from "./usersApiSlice";
import TextInput from "../../components/utils/TextInput";
import UpdateUserModal from "./UpdateUserModal";
import CustomSnackbar from "../../components/utils/CustomSnackbar";

export default function SearchUser() {
    const { role } = useAuth();

    const [userId, setUserId] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const [getUser, { isFetching, data, error, isSuccess, isError }] =
        useLazyGetUserQuery();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await getUser({ userId });
    };

    useEffect(() => {
        if (isSuccess && !isFetching) {
            setOpen(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching]);

    return role === "OWNER" ? (
        <div className={s.SearchUser}>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="userId"
                    margin="none"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Button variant="contained" type="submit" disabled={isFetching}>
                    {isFetching ? "LOADING..." : "SEARCH"}
                </Button>
            </form>
            {isError && <CustomSnackbar message={error} />}
            {isSuccess && <UpdateUserModal open={open} setOpen={setOpen} user={data?.user} />}
        </div>
    ) : null;
}
