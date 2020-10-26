import { Response } from "express";

export const jsonResponse = async (res: Response, fn: Function) => {
    try {
        const data = await fn();
        res.json({
            err: 0,
            payload: data
        });
    } catch (e) {
        // console.error(e);
        res.status(400);
        res.json({
            err: 1,
            message: e.message
        });
    }
};
