import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import User from "../entities/User";
import Tweet from "../entities/Tweet";
import Like from "../entities/Like";
import Reply from "../entities/Reply";

const like = async (req: Request, res: Response) => {
    const {identifier, slug, replyIdentifier, value} = req.body;

    if (![0, 1].includes(value)) { //0, 1의 value만 오는지 체크
        return res.status(400).json({value: "0, 1 value만 가능합니다."})
    }

    try {
        const user:User = res.locals.user;
        let post: Tweet = await Tweet.findOneByOrFail({identifier, slug});
        //게시물 찾기
        let like: Like | undefined; //좋아요 정보를 저장할 변수 타입
        let reply: Reply; //답글 정보를 저장할 변수 타입

        if (replyIdentifier) {
            //답글 identifier가 있으면 답글 like 찾기 (=답글일 경우 로직 실행)
            reply = await Reply.findOneByOrFail({identifier: replyIdentifier}); //만약 변수를 찾지 못하면 error catch
            like = await Like.findOneBy({username: user.username, replyId:reply.id});
        } else {
            like = await Like.findOneBy({username: user.username, tweetId:post.id});
        }

        if (!like && value === 0) {//좋아요가 아직 눌리지 않았는데 좋아요를 취소하려고 하면 오류 반환
            return res.status(404).json({error: "Like를 찾을 수 없습니다."})
        } else if (!like) { //like 객체가 없으면 새로 생성하고 사용자와 좋아요 값을 설정하고 db에 저장
            like = new Like ();
            like.user = user;
            like.value = value;
                if (reply) { //답글이 있으면 like객체에 reply를 설정
                    like.reply = reply;
                }
                else like.tweet = post; //답글이 아니면 like객체에 tweet을 설정
            await like.save(); //db에 저장
        } else if (value === 0) { //좋아요를 취소하려고 하면 like 객체를 db에서 삭제함
            like.remove();
        } else if (like.value != value) { //좋아요를 누르거나 취소하려고 할때 (값에 변동이 있을때) value를 업뎃함
            like.value = value;
            await like.save();
        }

        post = await Tweet.findOneOrFail({ //좋아요를 누르거나 취소한 후에 게시글과 관련된 정보를 다시 db에서 가져옴
            where: {
                identifier, slug
            },
            relations: ["replies", "replies.likes", "likes"]
        })
        post.setUserLike(user); // 현 트윗에 사용자가 좋아요를 눌렀는지 설정하는 메서드 호출
        post.replies.forEach(c => c.setUserLike(user)); //모든 답글들에 사용자가 좋아요를 눌렀는지 설정하는 메서드 호출
        //프론트에서 각 게시글이나 답글이 현재 사용자에게 좋아요를 받았는지 쉽게 알 수 있음

        return res.json(post); //프론트로 응답
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"문제가 발생했습니다."});
    }
}


const router = Router();
router.post("/", userMiddleware, authMiddleware, like);

export default router;