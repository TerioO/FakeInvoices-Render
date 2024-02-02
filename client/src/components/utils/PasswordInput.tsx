import { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type Props = {
    label?: string;
    size?: "small" | "medium";
    required?: boolean;
    iconBtnSize?: "small" | "medium" | "large";
    className?: string;
    fullWidth?: boolean;
    variant?: "outlined" | "filled" | "standard";
    margin?: "none" | "dense" | "normal";
    error?: boolean;
    helperText?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({
    label,
    size,
    iconBtnSize,
    required,
    className,
    fullWidth,
    variant,
    margin,
    error,
    helperText,
    value,
    onChange
}: Props) {
    const [show, setShow] = useState<boolean>(false);

    return (
        <TextField
            className={className || ""}
            type={show ? "text" : "password"}
            label={label || "Password"}
            required={required || true}
            size={size || "small"}
            fullWidth={fullWidth || false}
            variant={variant || "outlined"}
            margin={margin || "normal"}
            error={error || false}
            helperText={helperText || ""}
            value={value}
            onChange={onChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            size={iconBtnSize || "small"}
                            onClick={() => {
                                setShow(!show);
                            }}
                        >
                            {!show ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}
