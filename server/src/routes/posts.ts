import { NextFunction, Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import User from "../entities/User";
import Tweet from "../entities/Tweet";


const getPost = async (req: Request, res: Response) => {
    const {identifier, slug} = req.params; //HTTP 요청의 URL 경로의 파라미터를 포함하는 객체

    try {
        const post = await Tweet.findOneOrFail({
            where: {identifier, slug},
            relations: ["user", "likes", "retweets"] //관련 있는 엔티티들을 함게 불러옴
        }
        );

        if (res.locals.user) {
            post.setUserLike(res.locals.user); //현 유저가 like를 눌렀는지 확인
            post.setUserRetweet(res.locals.user);
        }

        return res.send(post); //post 객체를 HTTP 응답의 본문으로 보냄
    } catch (error) {
        console.log(error);
        console.log("posts.ts의 getPost 오류")
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다."});
    }

}

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

router.get("/:identifier/:slug", userMiddleware, getPost);
router.post("/", userMiddleware, authMiddleware, createPost);

export default router;