import { NextFunction, Request, Response } from "express";
import User from "../entities/User";

// 유저 정보에 따라서 인증을 하는 미들웨어
export default async (_: Request, res: Response, next: NextFunction) => {
    try {
        //user.ts (유저 미들웨어)에서 저장한 res.locals.user를 가져와서 user에 저장
        const user: User | undefined = res.locals.user;
        //만약, 유저 미들웨어에서 token이 없어서 res.locals.user가 없으면 user가 undefined임

        if (!user) throw new Error("Unauthenticaed");
        //user가 undefined라면 Unauthenticated 메세지 반환. catch 블록으로 이동 후 401 메세지 출력

        return next();

    } catch (error) {  
        console.log(error);
        return res.status(401).json({ error: "Unauthenticated" });
    }
};