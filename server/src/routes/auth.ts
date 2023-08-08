import { Request, Response, Router } from "express";
import { isEmpty, validate } from "class-validator";
import User from "../entities/User";
import  bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";


interface ErrorObject {
    property: string;
    constraints: { [key: string]: string };
  }




const logout = async ( _ : Request, res : Response) => {
    res.set (
        "Set-Cookie",
        cookie.serialize("token", "", {
            httpOnly: true,
            secure:process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        })
    );
    res.status(200).json({success: true});
}

const mapError = (errors: Object[]) => {
return errors.reduce((prev:any, err:any) => {
     prev[err.property] = Object.entries(err.constraints)[0][1];
      return prev;
     },{});
 }
 
// 현재 로그인한 사용자의 정보 반환
const me = async (_: Request, res: Response) => {
     return res.json(res.locals.user); 
     //res.locals는 express에서 제공한 객체, .user는 posts.ts 미들웨어에서 온것
};

const register = async (req: Request, res: Response) => {
    const {email, username, password, nickname} = req.body;

    try {
        let errors: any = {};
        // 중복된 이메일, username 확인
        const emailUser = await User.findOneBy({email});
        const usernameUser = await User.findOneBy({username});

        //이미 있다면 errors 객체에 넣음
        if (emailUser) {errors.email = "이미 사용된 이메일 주소입니다.";}
        if (usernameUser) {errors.username = "이미 사용된 닉네임입니다";}

        if (Object.keys(errors).length > 0) { //에러가 있다면 에러를 response 반환
            return res.status(400).json(errors);
        }

        const user = new User(); //User 클래스의 새로운 인스턴스 생성 (user라는 이름으로)
        user.email = email; //user 객체의 email 필드에 email 변수값 할당
        user.username = username;
        user.password = password;
        user.nickname = nickname;
        //const user = new User ({email, username, password});랑 기능적으로는 같지만, User 클래스의 생성자가
        // 해당 형식의 매개변수를 받도록 이미 설계가 돼있어야함.

        //엔티티에 정해놓은 조건으로 user 데이터의 유효성 검사하기
        errors = await validate(user);
        if (errors.length > 0) {
            return res.status(400).json(mapError(errors));
        }
        //validate 함수에서 에러가 있다면 mapError 함수를 호출하여 에러를 response 반환. db에 저장되지 않음

        await user.save(); //유저 정보를 User table에 저장
        return res.json(user); //저장된 유저 정보 response

    } catch (error) {
        console.log(error, "auth.ts register 오류");
        return res.status(500).json({error});
        
    }
};

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        let errors: any = {};

        //비워져있는지 확인하고, 비워져있다면 프론트로 에러 응답 반환
        if (isEmpty(username)) {
            errors.username = "유저명을 입력해주세요.";
        }
        if (isEmpty(password)) {
            errors.password = "비밀번호를 입력해주세요.";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        const user = await User.findOneBy({username});
        //username을 통해 유저의 정보가 담긴 row를 확인하고 해당 유저의 정보를 모두 user 객체에 담음
        if (!user) {
            return res.status(404).json({username: "유저가 존재하지 않습니다."});
        }
        
        //유저가 있다면, 비밀번호가 일치하는지 확인
        const passwordMatch = await bcrypt.compare (password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({password: "비밀번호가 잘못되었습니다."});
        }
        
        //비밀번호가 맞으면 토큰 생성
        const token = jwt.sign({username}, process.env.JWT_SECRET); //.env에서 가져옴

        //쿠키를 저장함
        res.set(
            "Set-Cookie", 
            cookie.serialize("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            path: "/"
        })
        );

        return res.json({user, token});

    } catch (error) {
        console.log(error, "auth.ts login 오류");
        return res.status(500).json({error});
    }
}



const router = Router();
router.get("/me", userMiddleware, authMiddleware, me);
router.post('/register', register);
router.post("/login", login);
router.post("/logout", userMiddleware, authMiddleware, logout);

export default router;