import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import User from "../entities/User";
import Tweet from "../entities/Tweet";
import Reply from "../entities/Reply";

const getUserData = async (req: Request, res: Response) => {
    try {
        //유저 정보 가져오기
        const user = await User.findOneOrFail({
            where: { username: req.params.username },
            select: ["username", "createdAt", "nickname"]
        })

        //해당 유저가 쓴 포스트 정보 가져오기
        const tweets = await Tweet.find({
            where: {username: user.username},
            relations: ["replies", "likes", "retweets", "user"],
        })

        //해당 유저가 쓴 답글 정보 가져오기
        // const replies = await Reply.find({
        //     where: {username: user.username},
        //     relations: ["tweets"],
        // })

        if (res.locals.user) {
            const {user} = res.locals;
            tweets.forEach ((t) => t.setUserLike(user));
            tweets.forEach ((t) => t.setUserRetweet(user));
            // replies.forEach ((t) => t.setUserLike(user));
            // replies.forEach ((t) => t.setUserRetweet(user));
        }

        let userData: any[] =[];

        //tweets와 replies를 순회하면서 각 요소를 새로운 객체로 변환하고 userData 배열에 추가함
        //toJSON 메서드는 객체의 속성을 새로운 객체로 복사하는데 사용됨.
        //(원본 객체를 변경하지 않고도 그 속성을 다른 객체에 사용할 수 있도록)
        tweets.forEach((t) => userData.push({type: "Tweet", ...t.toJSON()}));
        // replies.forEach((r) => userData.push({type: "Reply", ...r.toJSON()}));

        //최신 정보가 먼저 오게 순서 정렬
        //array.prototype.sort() 메서드로 userData 배열을 정렬함.
        //sort() 함수는 비교 함수를 인자로 받아 비교한 뒤 순서를 결정함.
        userData.sort((a, b) => {
            if (b.createdAt > a.createdAt) return 1; 
            //비교한 반환값이 0보다 작으면 a를 b보다 낮은 index로 정렬. a가 먼저 옴
            else if (b.createdAt < a.createdAt) return -1; 
            //비교한 반환값이 0보다 크면  a를 b보다 높은 index로 정렬. b가 먼저 옴
            else return 0;
            //같으면 0을 반환하여 순서를 변경하지 않음
        })

        return res.json ({user, userData});
        //유저 정보와 트윗 정보들을 클라로 응답 반환

    } catch (error) {
        console.log(error, "유저 정보 문제 발생.");
        return res.status(500).json({error:"문제가 발생했습니다."});
    }
}

const router = Router();

router.get("/:username", userMiddleware, getUserData);

export default router;