import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth, RoleType } from "../../hooks/useAuth";
import { setGLobalSnackbarMessage } from "../../app/slices/globalSnackbarSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { selectCurrentToken, setHasLoggedOut } from "./authSlice";
import { selectHasLoggedOut } from "./authSlice";

type Props = {
    roles: RoleType[];
};

export default function RequireAuth({ roles }: Props) {
    const dispatch = useAppDispatch();
    const hasLoggedOut = useAppSelector(selectHasLoggedOut);
    const user = useAuth();
    const location = useLocation();

    const token = useAppSelector(selectCurrentToken);
    const grantAccess = user.role ? roles.includes(user.role) : false;

    useEffect(() => {
        setTimeout(() => {
            // Why? If you're on a route that requires login and you logout, token becomes null and 
            // error message "Login required" will be displayed and app will navigate to "/"
            // Make it so that the message doesn't display when you press logout button but 
            // you also need to update the state back to false, so use this timeout to reset the state
            // after the token has been set to null.
            if(hasLoggedOut) dispatch(setHasLoggedOut(false));
        }, 1000)

        if (!token && !hasLoggedOut) {
            dispatch(
                setGLobalSnackbarMessage("Login required to access route")
            );
        } else if (token && !grantAccess) {
            dispatch(
                setGLobalSnackbarMessage("User doesnt have necessary role")
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grantAccess]);

    return (
        <>
            {token ? (
                grantAccess ? (
                    <Outlet />
                ) : (
                    <Navigate to="/" state={{ from: location }} replace />
                )
            ) : (
                <Navigate to="/login" state={{ from: location }} replace />
            )}
        </>
    );
}
