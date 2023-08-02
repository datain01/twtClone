import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import User from "../entities/User";
import Tweet from "../entities/Tweet";
import Bookmark from "../entities/Bookmark";
import Reply from "../entities/Reply";

const bookmark = async (req: Request, res: Response) => {
    const {identifier, slug, replyIdentifier, value} = req.body;

    if (![0, 1].includes(value)) { //0, 1의 value만 오는지 체크
        return res.status(400).json({value: "0, 1 value만 가능합니다."})
    }

    try {
        const user:User = res.locals.user;
        let post: Tweet = await Tweet.findOneByOrFail({identifier, slug});
        //게시물 찾기
        let bookmark: Bookmark | undefined; //좋아요 정보를 저장할 변수 타입
        let reply: Reply; //답글 정보를 저장할 변수 타입

        if (replyIdentifier) {
            //답글 identifier가 있으면 답글 bookmark 찾기 (=답글일 경우 로직 실행)
            reply = await Reply.findOneByOrFail({identifier: replyIdentifier}); //만약 변수를 찾지 못하면 error catch
            bookmark = await Bookmark.findOneBy({username: user.username, replyId:reply.id});
        } else {
            bookmark = await Bookmark.findOneBy({username: user.username, tweetId:post.id});
        }

        if (!bookmark && value === 0) {
            return res.status(404).json({error: "Bookmark를 찾을 수 없습니다."})
        } else if (!bookmark) { //bookmark 객체가 없으면 새로 생성하고 사용자와 좋아요 값을 설정하고 db에 저장
            bookmark = new Bookmark ();
            bookmark.user = user;
            bookmark.value = value;
                if (reply) { //답글이 있으면 bookmark객체에 reply를 설정
                    bookmark.reply = reply;
                }
                else bookmark.tweet = post; //답글이 아니면 bookmark객체에 tweet을 설정
            await bookmark.save(); //db에 저장
        } else if (value === 0) { 
            bookmark.remove();
        } else if (bookmark.value != value) { 
            bookmark.value = value;
            await bookmark.save();
        }

        post = await Tweet.findOneOrFail({
            where: {
                identifier, slug
            },
            relations: ["replies", "replies.bookmarks", "bookmarks"]
        })
        post.setUserBookmark(user); // 현 트윗에 사용자가 좋아요를 눌렀는지 설정하는 메서드 호출
        post.replies.forEach(c => c.setUserBookmark(user)); //모든 답글들에 사용자가 좋아요를 눌렀는지 설정하는 메서드 호출
        //프론트에서 각 게시글이나 답글이 현재 사용자에게 좋아요를 받았는지 쉽게 알 수 있음

        console.log("북마크서버성공")
        return res.json(post); //프론트로 응답
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"문제가 발생했습니다."});
    }
}


const router = Router();
router.post("/", userMiddleware, authMiddleware, bookmark);

export default router;