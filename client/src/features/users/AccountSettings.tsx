import s from "../../styles/User.module.scss";
import { useState } from "react";
import {
    useUpdateMyAccountMutation,
    UpdateMyAccountPayload,
} from "./usersApiSlice";
import { Button, Divider } from "@mui/material";
import PasswordInput from "../../components/utils/PasswordInput";
import PasswordErrorMessages from "../../components/utils/PasswordErrorMessages";
import { PASSWORD_REGEX } from "../../constants/regex";
import { useGetErrorMessage } from "../../hooks/useGetErrorMessage";

interface FormI extends UpdateMyAccountPayload {
    errorNewPassword: boolean;
}

export default function AccountSettings() {
    const [form, setForm] = useState<FormI>({
        currentPassword: "",
        newPassword: "",
        errorNewPassword: false,
    });

    const [updateMyAccount, { isLoading, isSuccess, error, isError, data }] =
        useUpdateMyAccountMutation();
    const errorMsg = useGetErrorMessage(error, null);

    const handleAccountUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updateMyAccount(form);
    };

    return (
        <div className={s.AccountSettings}>
            <h1>Account settings</h1>
            <section>
                <h2>Password</h2>
                <Divider />
                <form onSubmit={handleAccountUpdate} className={s.ChangePass}>
                    <div>
                        <PasswordInput
                            label="Current Password"
                            value={form.currentPassword}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    currentPassword: e.target.value,
                                }))
                            }
                        />
                        <PasswordInput
                            label="New Password"
                            value={form.newPassword}
                            error={form.errorNewPassword}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    newPassword: e.target.value,
                                    errorNewPassword: e.target.value
                                        ? !PASSWORD_REGEX.test(e.target.value)
                                        : false,
                                }))
                            }
                        />
                        <PasswordErrorMessages
                            password={form.newPassword}
                            shouldDisplay={form.errorNewPassword}
                        />
                        {isError && <p className="errorTRUE">{errorMsg}</p>}
                        {isSuccess && (
                            <p className="errorFALSE">{data?.message}</p>
                        )}
                        <Button
                            type="submit"
                            variant="outlined"
                            disabled={isLoading}
                        >
                            {isLoading ? "LOADING..." : "CHANGE"}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}
