import { NextFunction, Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import User from "../entities/User";
import Tweet from "../entities/Tweet";
import Reply from "../entities/Reply";
import { Like } from "typeorm";
import Notification from "../entities/Notification";
import { io } from "../socket";

// 트윗 검색하기
const searchTweets = async (req:Request, res:Response) => {
    try {
        const useSearch = req.query.term as string;
        let tweets: Tweet[];

        if (useSearch.startsWith('@')) {
            const username = useSearch.slice(1); //@를 생략하고 검색
            const user = await User.findOne ({where:{username}})
            if (user) {
                tweets = await Tweet.find ({
                    where: {username},
                    relations: ["user", "likes", "retweets", "replies", "bookmarks"]
                })
            } else {
                tweets = []; //사용자를 못찾으면 빈배열
            }
        } else {
            // 일반 검색일 경우
            tweets = tweets = await Tweet.find({
                    where: {content: Like(`%${useSearch}%`)}, //앞뒤로 %를 포함하면 이 단어를 포함한 걸 모두 검색할 수 있음! %를 안붙이면 정확히 일치하는 것만 검색된다
                    relations: ["user", "likes", "retweets", "replies", "bookmarks"],
                });
        }

    if (res.locals.user) {
        tweets.forEach((p)=>p.setUserLike(res.locals.user));
        tweets.forEach((p)=>p.setUserRetweet(res.locals.user));
        tweets.forEach((p)=>p.setUserBookmark(res.locals.user));
    }

    res.json({results: tweets});
    } catch (error) {
        console.log(error, "검색중 서버 오류")
        res.status(500).json({error: "검색 중 서버에 오류 발생"})
    }    
}

//메인 홈에 트윗들 띄우기
const getTweets = async (req: Request, res: Response) => {
    const currentPage: number = (req.query.page || 0) as number;
    const perPage: number = (req.query.count || 8) as number;

    try {
        const tweets = await Tweet.find ({
            order: {updatedAt: "DESC"},
            relations: ["user", "likes", "retweets", "replies", "bookmarks"],
            skip: currentPage * perPage,
            take: perPage,
        });

        if (res.locals.user) {
            tweets.forEach((p)=>p.setUserLike(res.locals.user));
            tweets.forEach((p)=>p.setUserRetweet(res.locals.user));
            tweets.forEach((p)=>p.setUserBookmark(res.locals.user));
            
        }

        return res.json(tweets);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "페이지를 가져오는 데 문제가 발생했습니다."})
    }
}

// 답글 표시하기 api
const getPostReplies = async (req: Request, res: Response) => {
    const {identifier, slug} = req.params;

    try {
        const post = await Tweet.findOneByOrFail({identifier, slug}); //identifier, slug를 이용해 트윗의 데이터 찾음. 없으면 error catch
        const replies = await Reply.find({ //위에서 찾아낸 트윗의 id를 이용해서 해당 트윗에 대한 모든 reply를 db에서 찾음
            where: {tweetId: post.id},
            order: {updatedAt:"DESC"}, //내림차순으로 정렬
            relations:["user", "likes", "retweets", "bookmarks"] //좋아요과 리트윗 정보도 포함해서
        });

        if (res.locals.user) { //로그인한 사용자가 각 답글에 대해 좋아요/리트윗을 했는지 설정
            replies.forEach((c) => c.setUserLike(res.locals.user))
            replies.forEach((c) => c.setUserRetweet(res.locals.user))
            replies.forEach((p)=>p.setUserBookmark(res.locals.user));
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
        const post = await Tweet.findOneOrFail({
            where: {identifier, slug},
            relations: ["user"]
        });
        const reply = new Reply();
        reply.content = content;
        reply.user = res.locals.user;
        reply.tweet = post;

        if (res.locals.user) {
            post.setUserLike(res.locals.user);
        }

        await reply.save();
            const notification = new Notification();
            notification.type = "reply";
            notification.sender = reply.user;
            notification.receiver = post.user;
            notification.tweet = post;
            notification.reply = reply;
            notification.read = false; //읽음상태 설정
            
            await notification.save();
            io.to(`notifications-${post.user.username}`).emit('new-notification', notification);

        
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
            relations: ["user", "likes", "retweets", "bookmarks"] //관련 있는 엔티티들을 함게 불러옴
        }
        );

        if (res.locals.user) {
            post.setUserLike(res.locals.user); //현 유저가 like를 눌렀는지 확인
            post.setUserRetweet(res.locals.user);
            post.setUserBookmark(res.locals.user);
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

        post.updatedAt = new Date();
        await post.save();
        return res.json({post, user}); //클라로 응답
    } catch (error) {
        console.log (error, "포스트 생성중 오류가 발생했습니다.")
        return res.status(500).json ({error: "포스트 생성중 오류가 발생했습니다."});
    } 
}

// 트윗 삭제하기
const deleteTweet = async (req:Request, res:Response) => {
    const {identifier, slug} = req.params;
    const user: User = res.locals.user;

    try {
        const post = await Tweet.findOneByOrFail({identifier, slug});

        // 자신의 트윗인지 확인
        if (post.username !== user.username) {
            return res.status(403).json({error: "자신의 트윗만 삭제할 수 있습니다."})
        }

        await post.remove();
        console.log("트윗 삭제 완료")
        return res.json({message:"트윗이 삭제됐습니다."});
       

    } catch (error) {
        return res.status(404).json ({error: "트윗을 찾을 수 없습니다."})
    }
    
}

const router = Router();

router.get("/:identifier/:slug/replies", userMiddleware, getPostReplies);

router.get("/:identifier/:slug", userMiddleware, getPost);
router.post("/", userMiddleware, authMiddleware, createPost);
router.delete("/:identifier/:slug", userMiddleware, authMiddleware, deleteTweet);

// 답글 api
router.post("/:identifier/:slug/replies", userMiddleware, createPostReply);

router.get("/", userMiddleware, getTweets);
router.get("/search", userMiddleware, searchTweets);

export default router;