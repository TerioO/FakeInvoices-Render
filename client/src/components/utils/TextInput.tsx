import { TextField } from "@mui/material";

type Props = {
    label?: string;
    size?: "small" | "medium";
    required?: boolean;
    className?: string;
    fullWidth?: boolean;
    variant?: "outlined" | "filled" | "standard";
    margin?: "none" | "dense" | "normal";
    error?: boolean;
    helperText?: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
    label,
    size,
    required,
    className,
    fullWidth,
    variant,
    type,
    margin,
    error,
    helperText,
    value,
    onChange,
}: Props) {
    return (
        <TextField
            type={type || "text"}
            label={label || ""}
            size={size || "small"}
            required={required || false}
            className={className || ""}
            fullWidth={fullWidth || false}
            variant={variant || "outlined"}
            margin={margin || "normal"}
            error={error || false}
            helperText={helperText || ""}
            value={value}
            onChange={onChange}
        />
    );
}
