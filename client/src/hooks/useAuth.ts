import { selectCurrentToken } from "../features/auth/authSlice"
import { useAppSelector } from "../app/hooks"
import { jwtDecode } from "jwt-decode"

export type RolesType = ("USER" | "ADMIN" | "OWNER")[];

interface JWTPayload {
    UserInfo: {
        id: string,
        firstName: string,
        roles: RolesType,
        isVerified: boolean
    }
}

interface UserInfo {
    firstName: string,
    roles: RolesType,
    status: "NOT LOGGED" | "LOGGED IN",
    isVerified: boolean
}

export const useAuth = () => {
    const token = useAppSelector(selectCurrentToken);
    const returnValue: UserInfo = {
        firstName: "",
        roles: [],
        status: "NOT LOGGED",
        isVerified: false
    }

    if(token) {
        const decoded = jwtDecode<JWTPayload>(token);
        returnValue.firstName = decoded.UserInfo.firstName;
        returnValue.roles = decoded.UserInfo.roles;
        returnValue.status = "LOGGED IN";
        returnValue.isVerified = decoded.UserInfo.isVerified
    }

    return returnValue;
}