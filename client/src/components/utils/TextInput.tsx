import { TextField } from "@mui/material";

type Props = {
    label?: string;
    size?: "small" | "medium";
    required?: boolean;
    className?: string;
    fullWidth?: boolean;
    variant?: "outlined" | "filled" | "standard";
    margin?: "none" | "dense" | "normal";
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
            value={value}
            onChange={onChange}
        />
    );
}
