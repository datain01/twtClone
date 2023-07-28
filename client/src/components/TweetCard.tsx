import { useAuthState } from '@/context/auth'
import { Tweet } from '@/types'
import axios from 'axios'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { ArrowRepeat, Bookmark, Chat, Heart, HeartFill } from 'react-bootstrap-icons'


interface TweetCardProps {
    post: Tweet
    mutate?: ()=>void //mutate는 index.tsx에서 넘겨주는거임...
}

const TweetCard = ({
  post: {
    identifier,
    slug,
    content,
    user,
    createdAt,
    updatedAt,
    url,
    userLike,
    likeScore,
    userRetweet,
    retweetScore,
    replyCount
  },
  mutate
}: TweetCardProps) => {
  const router = useRouter();
  const {authenticated} = useAuthState();

  const [showReply, setShowReply] = useState(false); //답글 버튼 눌렀을때 답멘창 보여주기 여부
    const [newReply, setNewReply] = useState(""); //답멘 제출용

    const submitReply = async (event: FormEvent) => {
      event.preventDefault();
      if (newReply.trim() === "") return;

      try {
          await axios.post(`/posts/${identifier}/${slug}/replies`, {
              content: newReply,
          });

          setNewReply("");
          // replyMutate();
      } catch (error) {
          console.log(error)
          console.log("답글 클라 제출 오류")
      }
  };

  const like = async (value: number) => {
    if (!authenticated) router.push("/login");
    if (value === userLike) value = 0;

    try {
      await axios.post("/likes", {identifier, slug, value});
      if (mutate) mutate();
      
    } catch (error) {
      console.log(error);
    }
  }

  const retweet = async (value: number) => {
    if (!authenticated) router.push("/login");
    if (value === userRetweet) value = 0;

    try {
      await axios.post("/retweets", {identifier, slug, value});
      if (mutate) mutate();

    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='card'>
      <div className='card-body'>
          <div className="mt-3 ms-4"> 
                {/* 본 트윗 시작*/}
                
                    <>
                <div className="d-flex">
                <Image src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="user" width="45" height="45" className='rounded-circle'/>
                <div className='ms-3'>
                    <strong >{user?.nickname}</strong>
                    <p className="mb-0 text-muted">@{user?.username}</p>
                </div>
                </div>
                <p className="mt-2 fs-4">{content}</p>
                <p className='fs-6 text-muted'>
                {dayjs(createdAt).format('A HH:mm · YYYY년 MM월 DD일')}
                </p>
                <p>
                    리트윗 {retweetScore} 좋아요 {likeScore}
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
                    <ArrowRepeat width="20" height="20" fill={userRetweet ? "#38B2AC" : "grey"} />
                </button>
                {/* 좋아요 */}
                <button type="button" className="btn btn-link text-muted"
                    onClick={()  => like(1)}>                
                    {userLike ? (
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

                {showReply && (<>
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
                                    <button className="btn btn-info text-light mt-2">
                                        트윗하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>)}
                    

                {/* 본 트윗 끝 */}
        </div>
      </div>
    </div>
  )
}

export default TweetCard