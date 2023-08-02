import { NextFunction, Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import User from "../entities/User";
import Tweet from "../entities/Tweet";
import Reply from "../entities/Reply";
import multer, { FileFilterCallback } from "multer";
import { makeId } from "../utils/helpers";
import path from "path";
import { unlinkSync } from "fs";
import Like from "../entities/Like";

const getLikedTweets = async (req: Request, res: Response) => {
    const {username} = req.params;

    try {
        const user = await User.findOneByOrFail({username});
        // 위에서 찾은 사용자의 좋아요 표시를 찾고 관련 트윗들을 찾기

        console.log(user);

        const likedTweets = await Like.find({
            where: {username},
            order: {createdAt: "DESC"},
            relations: ["tweet", "tweet.user", "tweet.replies", "tweet.likes", "tweet.retweets"]
        });

        console.log(likedTweets);

        const noReplyLikes = likedTweets.filter(l => l.tweet !== null);

        // 좋아요, 리트윗 남긴 것들 표시하기
        noReplyLikes.forEach((l) => {
            l.tweet.setUserLike(user);
            l.tweet.setUserRetweet(user);
        })

        // 좋아요 객체에서 트윗들을 추출하기
        const tweets = noReplyLikes.map((l) => l.tweet);
        return res.json(tweets);
    } catch (error) {
        console.log("좋아요 가져오기 오류", error);
        return res.status(500).json({error: "문제가 발생했습니다."})
    }
}

// 이미지 파일을 저장해두는 함수
const upload = multer ({
    storage: multer.diskStorage({ //파일을 디스크에 저장하기 위해 설정 시작. multer.diskStorage가 디스크 저장 엔진을 제공함
        destination: "public/images", //업로드된 파일을 public/images라는 디렉토리에 파일을 저장하도록 설정
        filename: (_, file, callback) => { //업로드된 파일의 이름을 어떻게 지정할지 정의하는 함수
            const name = makeId(10); //makeId 함수를 호출하여 10자리의 고유한 id를 생성, name 변수에 할당
            callback(null, "profile-" + name + path.extname(file.originalname))
            //콜백 함수를 호출하여 파일의 최종 이름 결정. profile-name변수.원래확장자
        },
    }),
    fileFilter: (_, file:any, callback:FileFilterCallback) => {
        //업로드된 파일 형식 검사하는 함수 정의
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            callback(null, true); //형식이 올바르면 콜백 함수를 호출하여 업로드를 계속함
        } else {
            callback(new Error ("이미지 형식이 아닙니다."));
            //형식이 틀리면 오류 메세지 전달, 업로드 중단
        }
    },
});

const uploadProfileImage = async (req: Request, res: Response) => {
    const user: User = res.locals.user; //현재 요청을 보낸 사용자의 정보를 user변수에 저장
    try {
        const type = req.body.type;
        //클라에서 보낸 본문에서 type 값을 추출
        // 파일 유형을 지정하지 않았을 때는 업로드 된 파일 삭제. 여기서는 프로필 사진만 받음
        if (type !== "profile") {
            if (!req.file?.path) { //업로드된 파일의 경로가 없는 경우 체크
                return res.status(400).json({error: "유효하지 않은 파일 형식 입니다."});
            }
            unlinkSync(req.file.path); //잘못된 파일 형식이 업로드 된 경우, 파일을 서버에서 삭제
            return res.status(400).json({error: "잘못된 파일 형식입니다."})
        }

        let oldProfileUrn:string = "";
        if (type === "profile") {
            // 현재 사용중인 profile urn 저장, 새로운 파일 이름을 urn으로 넣어줌
            oldProfileUrn = user.profileUrn || ""; 
            user.profileUrn = req.file?.filename || "";
        }
        await user.save();

        if (oldProfileUrn !== "") {
            const fullFilename = path.resolve(
                process.cwd(),
                "public",
                "images",
                oldProfileUrn
            );
            unlinkSync(fullFilename);
        }

        const imageUrl = `${process.env.APP_URL}/images/${user.profileUrn}`;
        console.log("Generated Image URL:", imageUrl);
        

        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"문제가 발생했습니다."});
    }
    
}

const ownProfile = async (req:Request, res:Response, next:NextFunction) => {
    const user: User = res.locals.user; //현재 접속한 유저
    const username: string = req.params.username; //URL에서 가져온 유저네임
    try {
        const profileUser = await User.findOneOrFail ({where: {username: username}});
        if (profileUser.username !== user.username) {
            return res.status(403).json({error: "이 프로필을 수정할 권한이 없습니다."});
        }
        next();
    } catch (error) {
        console.log(error);
        console.log("본인 확인 오류")
        return res.status(500).json({error: "문제가 발생했습니다."});
    }
}



const getUserData = async (req: Request, res: Response) => {
    try {
        //유저 정보 가져오기
        const user = await User.findOneOrFail({
            where: { username: req.params.username },
            select: ["username", "createdAt", "nickname", "profileUrn"]
        })

        //해당 유저가 쓴 포스트 정보 가져오기
        const tweets = await Tweet.find({
            where: {username: user.username},
            order: {createdAt: "DESC"},
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
router.post(
    "/:username/upload", 
    userMiddleware, 
    authMiddleware, 
    ownProfile,
    upload.single("file"), 
    uploadProfileImage);
router.get("/:username/likes", userMiddleware, getLikedTweets);

export default router;