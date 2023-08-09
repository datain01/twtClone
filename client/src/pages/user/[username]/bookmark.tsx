import TweetCard from "@/components/TweetCard";
import { Tweet } from "@/types";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

const Bookmark = () => {
  const router = useRouter();
  const username = router.query.username;

  //username이 있으면 /users/{username}에서 데이터를 가져오고, 없으면 null 반환
  const {
    data: bookmarksData,
    error: bookmarksError,
    mutate: mutateBookmark,
  } = useSWR<any>(username ? `/users/${username}/bookmarks` : null);

  return (
    <div>
      <div
        className="container border-bottom fs-3 fw-light ms-4"
        style={{ height: "3rem" }}
      >
        북마크 목록
      </div>
      <div>
        {/* 검색해서 나온 트윗들 나열 */}
        {bookmarksData?.map((tweet: Tweet) => (
          <TweetCard
            key={tweet.identifier}
            tweet={tweet}
            mutate={mutateBookmark}
          />
        ))}
      </div>
    </div>
  );
};

// 클라이언트 쪽에서 자신의 북마크만 볼 수 있도록 처리
//getServerSideProp은 Next.js에서 제공하는 기능. 서버 측에서 페이지를 렌더링하기 전에 실행되는 함수
export const getServerSideProps: GetServerSideProps = async ({
  //req(요청 객체), res(응답 객체), params(라우터 매개변수) 인자로 받음
  req,
  res,
  params,
}) => {
  try {
    //쿠키가 있는지 확인 (없으면 로그인이 필요하다는 뜻)
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("로그인이 필요합니다.");

    //쿠키가 있다면 그걸로 백엔드에서 인증처리함
    const { data: user } = await axios.get("/auth/me", { headers: { cookie } });

    // 로그인한 유저의 유저네임과 페이지의 유저네임이 다르면 홈으로 리다이렉트
    if (user.username !== params?.username) {
      res.writeHead(307, { Location: "/" }).end();
      return { props: {} };
    }

    return { props: {} };
  } catch (error) {
    //백엔드에서 요청에서 던져준 쿠키를 이용해 인증 처리할때 에러가 나면 /login으로 이동
    res.writeHead(307, { Location: "/login" }).end();
    return { props: {} };
  }
};

export default Bookmark;
