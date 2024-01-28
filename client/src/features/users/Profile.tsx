import s from "../../styles/User.module.scss";
import { useGetProfileQuery } from "./usersApiSlice";
import dayjs from "dayjs";
import CustomSnackbar from "../../components/utils/CustomSnackbar";
import CircularProgressCenter from "../../components/utils/CircularProgressCenter";

export default function Profile() {
    const { error, data, isLoading } = useGetProfileQuery();
    const user = data?.profile;

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
                    <div className={s.rolesArray}>
                        {user.roles.map((el) => (
                            <p key={el.toString()}>{el}</p>
                        ))}
                    </div>
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
        </div>
    );
}
