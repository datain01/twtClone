import { useAuth } from "@/context/auth";
import { useDarkModeClassNames } from "@/context/darkmode";
import { Tweet } from "@/types";
import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { mutate } from "swr";

const PostTweet = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { inputClass, btnClass } = useDarkModeClassNames();

  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data: post } = await axios.post<Tweet>("/posts", {
        content,
      });

      mutate(`/posts?page=0`); // Add this line to invalidate the cache

      router.push("/"); //트윗을 올리면 메인페이지로 리다이렉트
      // router.push (`/${post.identifier}/${post.slug}`);
    } catch (error: any) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-5 position-relative">
        <div className="mt-3">
          <Image
            src={
              user?.profileUrl ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt="user"
            width="50"
            height="50"
            className="rounded-circle"
          />
          <button
            className={`btn ${btnClass} position-absolute top-0 end-0 tweet-fixed-button`}
          >
            트윗하기
          </button>
        </div>
        <div className={`form-group ${inputClass}`}>
          <textarea
            className="form-control mt-2"
            id="exampleFormControlTextarea1"
            style={{
              width: "100%",
              height: "200px",
              resize: "none",
            }}
            placeholder="무슨 일이 일어나고 있나요?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
      </div>
    </form>
  );
};

export default PostTweet;

//getServerSideProp은 Next.js에서 제공하는 기능. 서버 측에서 페이지를 렌더링하기 전에 실행되는 함수
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("로그인이 필요합니다.");

    //쿠키가 있다면 그걸로 백엔드에서 인증처리함
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });

    return { props: {} };
  } catch (error) {
    //백엔드에서 요청에서 던져준 쿠키를 이용해 인증 처리할때 에러가 나면 /login으로 이동
    res.writeHead(307, { Location: "/login" }).end();
    return { props: {} };
  }
};
