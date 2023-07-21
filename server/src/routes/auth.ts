import { Request, Response, Router } from "express";
import User from "../entities/User";
import { validate } from "class-validator";

const register = async (req: Request, res: Response) => {
    const {email, username, password} = req.body;
    // console.log('email', email);

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
        //const user = new User ({email, username, password});랑 기능적으로는 같지만, User 클래스의 생성자가
        // 해당 형식의 매개변수를 받도록 이미 설계가 돼있어야함.

        //엔티티에 정해놓은 조건으로 user 데이터의 유효성 검사하기
        errors = await validate(user);

        await user.save(); //유저 정보를 User table에 저장

        return res.json(user); //저장된 유저 정보 response

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "서버에 문제가 있습니다."});
        
    }
};

const mapErrors = (errors: Object[]) => {
    return errors.reduce((prev:any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1];
        return prev;
    }, {}); //두번째 인자가 초기값인 빈 객체{}라는 뜻
};

const router = Router();
router.post('/register', register);

export default router;