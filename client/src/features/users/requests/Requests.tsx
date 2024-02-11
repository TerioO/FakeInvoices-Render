import s from "../../../styles/Requests.module.scss";
import { useAuth } from "../../../hooks/useAuth";
import OwnerReqVersion from "./OwnerReqVersion";
import UserReqVersion from "./UserReqVersion";

export default function Requests() {
    const { role } = useAuth();

    return (
        <div className={s.Requests}>
            <h1>{role != "OWNER" ? "My Requests" : "Requests"}</h1>
            {role === "OWNER" ? <OwnerReqVersion /> : <UserReqVersion />}
        </div>
    );
}
