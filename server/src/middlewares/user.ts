import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

//핸들러에서 유저정보를 필요할 때 사용하는 미들웨어
export default async (req: Request, res: Response, next: NextFunction) => {
 try { //nextFunction: 다음 미들웨어 함수를 호출하는 함수. return next()시, 현재 미들웨어가 즉시 종료됨
    const token = req.cookies.token; //클라 요청의 쿠키에 담겨있는 토큰을 가져옴
    if (!token) return next(); //토큰이 없으면 next()를 호출해서 다음 미들웨어 함수로 넘어감.

    const {username}: any = jwt.verify(token, process.env.JWT_SECRET!);
    //jwt.verify(JWT 문자열, 서명을 생성할 때 사용한 비밀 키) -> 토큰이 유효하면 토큰의 페이로드를 반환, 아니면 오류 반환.
    //반환된 페이로드 (추가 데이터)에서 "username"을 추출.
    //타입스크립트의 !는 "non-null assertion"로 환경변수가 반드시 존재하며, null이나 undefined가 아니란 것을 알려줌

    const user = await User.findOneBy({username});
    console.log('user token check', user);
    //위에서 추출한 username을 이용해서 데이터베이스에 해당 username이 있는지 확인.
    //여기서 await는 데이터베이스 쿼리가 완료될때까지 기다리라는 뜻

    if(!user) throw new Error("Unauthenticated user");

    //db에서 찾은 유저 정보를 res.local.user에 넣음
    res.locals.user = user;
    //res.locals는 express.js에서 제공하는 객체. 현재 요청의 생명주기 동안 사용할 수 있는 변수를 저장하는데 사용됨
    //user 데이터 (위에서 찾은거)를 res.locals 객체에 user라는 키로 저장.
    //저장된 데이터는 이후의 미들웨어 함수에서 res.locals.user를 통해 접근할 수 있게됨
    //다른 미들웨어에서도 사용자 정보를 사용할 수 있게 하는 역할.

    return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "User middleware error"});
    }
}