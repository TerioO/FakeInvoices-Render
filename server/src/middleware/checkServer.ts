import { RequestHandler } from "express";

export const checkIfServerOn: RequestHandler = async (req, res) => {
    res.status(200).json({ message: "Server is ON" });
};