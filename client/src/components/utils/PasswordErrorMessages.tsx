import s from "../../styles/Auth.module.scss";
import {
    ONE_DIGIT,
    ONE_LOWERCASE,
    ONE_UPPERCASE,
    ONE_SPECIAL,
    AT_LEAST_8_32,
} from "../../constants/regex";

type Props = {
    password: string;
    shouldDisplay: boolean;
};

export default function PasswordErrorMessages({
    password,
    shouldDisplay,
}: Props) {
    return shouldDisplay ? (
        <div className={s.errorPass}>
            <p className="errorTRUE">Password must contain: </p>
            <ul>
                <li
                    className={
                        ONE_UPPERCASE.test(password)
                            ? "errorFALSE"
                            : "errorTRUE"
                    }
                >
                    1 Upper case character
                </li>
                <li
                    className={
                        ONE_LOWERCASE.test(password)
                            ? "errorFALSE"
                            : "errorTRUE"
                    }
                >
                    1 Lower case character
                </li>
                <li
                    className={
                        ONE_DIGIT.test(password) ? "errorFALSE" : "errorTRUE"
                    }
                >
                    1 number
                </li>
                <li
                    className={
                        ONE_SPECIAL.test(password) ? "errorFALSE" : "errorTRUE"
                    }
                >
                    1 special character [#?!@$ %^&*-]
                </li>
                <li
                    className={
                        AT_LEAST_8_32.test(password)
                            ? "errorFALSE"
                            : "errorTRUE"
                    }
                >
                    8-32 characters long
                </li>
            </ul>
        </div>
    ) : null;
}
