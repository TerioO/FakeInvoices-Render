import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { useEffect, useState } from "react";

export const useGetErrorMessage = (
    error: SerializedError | FetchBaseQueryError | undefined,
    stateToClearMessage: unknown
) => {
    const [clearError, setClearError] = useState<boolean>(false);
    let msg: string | undefined = "";
    if(error){
        if("status" in error){
            if("error" in error) msg = error.error;
            else {
                const res = error.data as { message: string, isError: boolean };
                msg = res.message;
            }
        }
        else {
            msg = error.message;
        }
    }

    useEffect(() => {
        setClearError(true);
    }, [stateToClearMessage]);

    useEffect(() => {
        setClearError(false);
    }, [error])

    return clearError ? "" : msg;
}