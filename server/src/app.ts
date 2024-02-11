import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import { errorHandler } from "./middleware/errorHandler";
import { checkIfServerOn } from "./middleware/checkServer";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import invoiceRouter from "./routes/invoiceRouter";
import userRequestRouter from "./routes/userRequestRouter";

export const createApp = () => {
    const app = express();

    // Middleware:
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.get("/", (req, res) => {
        res.status(200).send("Hello, work in progress...");
    });
    app.get("/serverOn", checkIfServerOn);
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/invoice", invoiceRouter);
    app.use("/user-requests", userRequestRouter);

    app.all("*", (req, res) => {
        res.status(404);
        if(req.accepts("html")) return res.send("404 - Not Found");
        else if(req.accepts("json")) return res.json({ message: "404 - Not Found" });
        else return res.send("404 - Not Found");
    });

    app.use(errorHandler);

    return app;
};