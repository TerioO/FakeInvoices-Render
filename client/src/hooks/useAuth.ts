import { selectCurrentToken } from "../features/auth/authSlice"
import { useAppSelector } from "../app/hooks"
import { jwtDecode } from "jwt-decode"

export type RoleType = ("USER" | "READER" | "OWNER");

interface JWTPayload {
    UserInfo: {
        id: string,
        firstName: string,
        role: RoleType,
        isVerified: boolean
    }
}

interface UserInfo {
    firstName: string,
    role: RoleType | undefined,
    status: "NOT LOGGED" | "LOGGED IN",
    isVerified: boolean
}

export const useAuth = () => {
    const token = useAppSelector(selectCurrentToken);
    const returnValue: UserInfo = {
        firstName: "",
        role: undefined,
        status: "NOT LOGGED",
        isVerified: false
    }

    if(token) {
        const decoded = jwtDecode<JWTPayload>(token);
        returnValue.firstName = decoded.UserInfo.firstName;
        returnValue.role = decoded.UserInfo.role;
        returnValue.status = "LOGGED IN";
        returnValue.isVerified = decoded.UserInfo.isVerified
    }

    return returnValue;
}