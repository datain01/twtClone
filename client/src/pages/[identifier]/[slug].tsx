import { Reply, Tweet } from '@/types';
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { ArrowRepeat, Bookmark, Chat, Heart, HeartFill } from 'react-bootstrap-icons';
import { useAuthState } from '@/context/auth';
import dayjs from 'dayjs';
import 'dayjs-ext/locale/ko'
import axios from 'axios';
import Link from 'next/link';


const TweetPage = () => {
    const router = useRouter();
    const {identifier, slug} = router.query; //현재 URL의 쿼리 문자열 부분을 파싱하여 자바스크립트 객체로 제공
    const {authenticated, user} = useAuthState(); //로그인 시에만 답글 작성 input을 보여주게 하기위해 인증

    const [showReply, setShowReply] = useState(false); //답글 버튼 눌렀을때 답멘창 보여주기 여부
    const [newReply, setNewReply] = useState(""); //답멘 제출용

    const {data: post, error, mutate:postMutate} = useSWR<Tweet> ( //data: 요청한 데이터
        identifier && slug ? `/posts/${identifier}/${slug}` : null
        //useSWR은 fetch 함수를 이용하여 데이터를 반환함
        //identifier와 slug가 없다면 null 반환
    );

    const {data: replies, mutate:replyMutate} = useSWR<Reply[]>( //답글 데이터 가져오기
        identifier && slug ? `/posts/${identifier}/${slug}/replies` : null
    );

    const submitReply = async (event: FormEvent) => {
        event.preventDefault();
        if (newReply.trim() === "") return;

        try {
            await axios.post(`/posts/${identifier}/${slug}/replies`, {
                content: newReply,
            });

            setNewReply("");
            replyMutate();
        } catch (error) {
            console.log(error)
            console.log("답글 클라 제출 오류")
        }
    };

    const like = async (value: number, reply?: Reply) => {
        if (!authenticated) router.push("/login");

        // 이미 좋아요를 했으면 리셋
        if ((!reply && value === post?.userLike) ||
        (reply && reply.userLike === value)) {
            value = 0;
        }
        try {
            await axios.post("/likes", {
                identifier,
                slug,
                replyIdentifier: reply?.identifier,
                value
            })
            postMutate();
            replyMutate();
        } catch (error) {
            console.log(error)
        }
    }

    const retweet = async (value: number, reply?: Reply) => {
        if (!authenticated) router.push("/login");
    
        // 이미 리트윗을 했으면 리셋
        if ((!reply && value === post?.userRetweet) ||
        (reply && reply.userRetweet === value)) {
            value = 0;
        }
        try {
            await axios.post("/retweets", {
                identifier,
                slug,
                replyIdentifier: reply?.identifier,
                value
            })
            postMutate();
            replyMutate();
        } catch (error) {
            console.log(error);
        }
    }
    
    dayjs.locale('ko');
  return (
    // 나중에 헤더 만들어서 넣자
    <div className="mt-5 ms-4" style={{height:"96vh", overflow:"auto"}}> 
            {/* 본 트윗 시작*/}
            {post && post.user &&(
                <>
            <div className="d-flex">
            <Link href={`/user/${post.user?.username}`} className='text-decoration-none' onClick={(e)=>{e.stopPropagation()}}>
            <Image src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="user" width="45" height="45" className='rounded-circle'/>
            </Link>
            <Link href={`/user/${post.user?.username}`} className='text-decoration-none' onClick={(e)=>{e.stopPropagation()}}>
            <div className='ms-3'>
                <strong style={{color:"black"}}>{post.user.nickname}</strong>
                <p className="mb-0 text-muted">@{post.user.username}</p>
            </div>
            </Link>
            </div>
            <p className="mt-2 fs-4">{post.content}</p>
            <p className='fs-6 text-muted'>
             {dayjs(post.createdAt).format('A HH:mm · YYYY년 MM월 DD일')}
            </p>
            <p>
                리트윗 {post?.retweetScore} 좋아요 {post?.likeScore}
            </p>
            <div className="d-flex justify-content-between">
            {/* 답글 버튼 */}
            <button type="button" className="btn btn-link text-muted" 
                onClick={()=>{
                    if (authenticated) {
                        setShowReply(prevShowReply => !prevShowReply);
                    } else {
                        router.push("/login")
                    }                    
                    }}>
                <Chat width="20" height="20" fill="grey" />
            </button>
            {/* 리트윗 */}
            <button type="button" className="btn btn-link text-muted"
            onClick={()  => retweet(1)}>
                <ArrowRepeat width="20" height="20" fill={post.userRetweet ? "#38B2AC" : "grey"} />
            </button>
            {/* 좋아요 */}
            <button type="button" className="btn btn-link text-muted"
                onClick={()  => like(1)}>                
                {post.userLike ? (
                    <HeartFill width="20" height="20" fill="red" />
                    ) : (
                    <Heart width="20" height="20" fill="grey" />
                )}
                
            </button>
            <button type="button" className="btn btn-link text-muted">
                <Bookmark width="20" height="20" fill="grey" />
            </button>
            </div>
            </>
            )}
            {showReply && (
                <>
                    <form onSubmit={submitReply}>
                        <div className='mt-4  position-relative d-flex'>
                            <Image src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
                            alt="user" width="40" height="40" 
                            className='rounded-circle'/>
                            <textarea className="form-control ms-2"
                                id="exampleFormControlTextarea1"
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    resize: "none"
                                }}
                                placeholder ="무슨 일이 일어나고 있나요?"
                                value={newReply}
                                onChange={(e)=>setNewReply(e.target.value)}
                            />
                            
                        </div>
                        <div className='container text-center'>
                            <div className='row'>
                                <div className='col'>
                                
                                </div>
                                <div className='col-2'>
                                <button className="btn btn-info text-light mt-2 reply-fixed-button">
                                    트윗
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </>
                )}
            {/* 본 트윗 끝 */}

            {/* 답글 리스트 시작 */}
            <div className='mx-3 mt-5'>
            {replies?.map (reply => (
                <div className='flex mt-3 mb-5' key = {reply.identifier}>

                    <div className="d-flex">
                    <Link href={`/user/${reply.user?.username}`} className='text-decoration-none' onClick={(e)=>{e.stopPropagation()}}>
                        <Image src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
                        alt="user" width="40" height="40" className='rounded-circle'/>
                        </Link>
                        <Link href={`/user/${reply.user?.username}`} className='text-decoration-none' onClick={(e)=>{e.stopPropagation()}}>
                        <div className='ms-3'>
                            <strong style={{color:"black"}}>{reply.user.nickname}</strong>
                            <p className="mb-0 text-muted">@{reply.user.username}</p>
                        </div>
                        </Link>
                    </div>
                    <p className="mt-2 fs-5">{reply.content}</p>
                    <p className='fs-6 text-muted'>
                        {dayjs(reply!.createdAt).format('A HH:mm · YYYY년 MM월 DD일')}
                    </p>
                    <p>
                        리트윗 {reply.retweetScore} 좋아요 {reply.likeScore}
                    </p>
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-link text-muted"
                        onClick={()  => retweet(1, reply)}>
                        <ArrowRepeat width="20" height="20" fill={reply.userRetweet ? "green" : "grey"} />
                        </button>
                        <button type="button" className="btn btn-link text-muted"
                        onClick={() => like(1, reply)} >
                            {reply.userLike ? (
                                <HeartFill width="20" height="20" fill="red" />
                                ) : (
                                <Heart width="20" height="20" fill="grey" />
                            )}
                        </button>
                        <button type="button" className="btn btn-link text-muted">
                            <Bookmark width="20" height="20" fill="grey" />
                        </button>
                    </div>

                </div>  
            
            ))}
            </div>

            
    </div>

  )
}

export default TweetPage
