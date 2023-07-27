import { NextFunction, Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import User from "../entities/User";
import Tweet from "../entities/Tweet";
import Reply from "../entities/Reply";


// 답글 표시하기 api
const getPostReplies = async (req: Request, res: Response) => {
    const {identifier, slug} = req.params;

    try {
        const post = await Tweet.findOneByOrFail({identifier, slug}); //identifier, slug를 이용해 트윗의 데이터 찾음. 없으면 error catch
        const replies = await Reply.find({ //위에서 찾아낸 트윗의 id를 이용해서 해당 트윗에 대한 모든 reply를 db에서 찾음
            where: {tweetId: post.id},
            order: {createdAt:"DESC"}, //내림차순으로 정렬
            relations:["user", "likes", "retweets"] //좋아요과 리트윗 정보도 포함해서
        });

        if (res.locals.user) { //로그인한 사용자가 각 답글에 대해 좋아요/리트윗을 했는지 설정
            replies.forEach((c) => c.setUserLike(res.locals.user))
            replies.forEach((c) => c.setUserRetweet(res.locals.user))
        }

        return res.json(replies); //응답!!!!
    } catch (error) {
        console.log(error);
        console.log("createPostReply 에러");
        return res.status(500).json({error:"문제가 발생했습니다."});
    }

}

// 답글 포스트하기 api
const createPostReply = async (req: Request, res: Response) => {
    const {identifier, slug} = req.params;
    const content = req.body.content;

    try {
        const post = await Tweet.findOneByOrFail({identifier, slug});
        const reply = new Reply();
        reply.content = content;
        reply.user = res.locals.user;
        reply.tweet = post;

        if (res.locals.user) {
            post.setUserLike(res.locals.user);
        }

        await reply.save();
        return res.json(reply);

    } catch (error) {
        console.log(error);
        console.log("createPostReply 에러");
        return res.status(404).json({error: "문제가 발생했습니다."})
        
    }
}
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

router.get("/:identifier/:slug/replies", userMiddleware, getPostReplies);

router.get("/:identifier/:slug", userMiddleware, getPost);
router.post("/", userMiddleware, authMiddleware, createPost);

// 답글 api
router.post("/:identifier/:slug/replies", userMiddleware, createPostReply);

export default router;