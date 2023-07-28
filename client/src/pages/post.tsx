import { Tweet } from '@/types';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react'

const PostTweet = () => {
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<any>({});

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        try {
            const {data: post} = await axios.post<Tweet>("/posts", {
                content
            })

            router.push ("/"); //트윗을 올리면 메인페이지로 리다이렉트
            // router.push (`/${post.identifier}/${post.slug}`);
        } catch (error:any) {
            console.log(error);
            setErrors(error.response.data);
        }
        
    }

  return (
    <form onSubmit={handleSubmit}>
        <div className="mx-5 position-relative">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">유저사진</label>
            <button className="btn btn-info position-absolute top-0 end-0 mt-2 text-light tweet-fixed-button">
                트윗하기
                </button>
            <textarea className="form-control mt-4"
            id="exampleFormControlTextarea1"
            style={{
                width: "100%",
                height: "200px",
                resize: "none"
            }}
            placeholder="무슨 일이 일어나고 있나요?"
            value={content}
            onChange={(e)=>setContent(e.target.value)}
            ></textarea>
        </div>
    </form>
    
  )
}

export default PostTweet

export const getServerSideProps: GetServerSideProps = async({req, res}) => {
    try {
        const cookie = req.headers.cookie;
        if(!cookie) throw new Error ("로그인이 필요합니다.");

        //쿠키가 있다면 그걸로 백엔드에서 인증처리함
        await axios.get("/auth/me", {headers: {cookie}});

        return {props: {}};

    } catch (error) {
        //백엔드에서 요청에서 던져준 쿠키를 이용해 인증 처리할때 에러가 나면 /login으로 이동
        res.writeHead(307, {Location: "/login"}).end();
        return {props: {}};
    }
}