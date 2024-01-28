import React from "react";

export default function _404() {
    return (
        <div style={style}>
            <h1 style={{ textAlign: "center" }}>404 - Not Found</h1>
            <p style={{ textAlign: "center" }}>
                Please use the header to navigate somewhere else.
            </p>
        </div>
    );
}

const style: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};
