import TweetCard from '@/components/TweetCard';
import { Reply, Tweet } from '@/types';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router'
import React from 'react'
import { ArrowRepeat, Bookmark, Heart, HeartFill } from 'react-bootstrap-icons';
import useSWR from 'swr'

const UserPage = () => {
    const router = useRouter();
    const username = router.query.username;
    
    // username이 있으면 /users/{username}에서 데이터를 가져오고, 없으면 null 반환
    const {data, error} = useSWR<any>(username ? `/users/${username}`: null);

    if (!data) return <div>Loading...</div>;
    

  return (
    <div style={{height:"100vh", overflow:"auto"}}>
      <div className="card">
      <Image src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
                                    alt="user" width="50" height="50" 
                                    className='rounded-circle ms-3 mt-3'/>
      <div className="card-body">
        <h5 className="card-title">{data.user.nickname}</h5>
        <p className="card-subtitle text-muted">@{data.user.username}</p>
        <p className='card-text mt-3'>자기소개</p>
        <p> {dayjs(data.user.createdAt).format("YYYY.MM.DD")} 가입</p>
      </div>
    </div>

    <ul className="nav nav-tabs">
      <li className="nav-item">
        <a className="nav-link active" data-bs-toggle="tab" href="#tweets">Tweets</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" data-bs-toggle="tab" href="#media">Medias</a>
      </li>
    </ul>

    <div className="tab-content">
  <div className="tab-pane fade show active" id="tweets">
    {/* 트윗 내용 */}
    {data.userData.map((data:any) => {
      if (data.type === "Tweet") {
        const tweet:Tweet = data;
        return <TweetCard key={tweet.identifier} tweet={tweet}/>
      }
    })}
  </div>
  </div>
</div>
)}

export default UserPage
