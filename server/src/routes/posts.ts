import { NextFunction, Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import User from "../entities/User";
import Tweet from "../entities/Tweet";


const createPost = async (req: Request, res: Response, next: NextFunction) => {
    const {content} = req.body;

    try {
        let errors:any = {};
        if (isEmpty(content)) errors.title = "트윗은 비워둘 수 없습니다.";
        if (Object.keys(errors).length > 0) throw errors;

    } catch (error) {
        console.log(error, "포스트 생성중 빈칸 오류가 발생했습니다.");
        return res.status(500).json({error: "포스트 생성중 빈칸 오류가 발생했습니다."})
    }

    try {
        const user: User = res.locals.user;

        const post = new Tweet();
        post.content = content;
        post.user = user;

        await post.save();
        return res.json(post); //클라로 응답
    } catch (error) {
        console.log (error, "포스트 생성중 오류가 발생했습니다.")
        return res.status(500).json ({error: "포스트 생성중 오류가 발생했습니다."});
    }
    
    
}


const router = Router();
router.post("/", userMiddleware, authMiddleware, createPost);

export default router;