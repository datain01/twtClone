import TweetCard from '@/components/TweetCard';
import { useAuthState } from '@/context/auth';
import { Reply, Tweet } from '@/types';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import axios from 'axios';

const UserPage = () => {
    const router = useRouter();
    const username = router.query.username;
    
    // username이 있으면 /users/{username}에서 데이터를 가져오고, 없으면 null 반환
    const { data: userData, error: userError } = useSWR<any>(username ? `/users/${username}` : null);
    const { data: likesData, error: likesError } = useSWR<any>(username ? `/users/${username}/likes` : null);

    // Tweets, Likes 탭 이동용
    const [activeTab, setActiveTab] = useState('tweets');

    // ==========사진 올리기용 시작!!==========
    const [ownProfile, setOwnProfile] = useState(false);
    const {authenticated, user} = useAuthState();


    // 숨겨진 파일 입력 요소에 대한 참조를 저장 
    const fileInputRef = useRef<HTMLInputElement>(null); 
    
    useEffect(() => { //자신의 프로필만 수정가능
        if (!userData) return;
        setOwnProfile(authenticated && user?.username === username);      
    }, [username]);
    
    // 선택된 이미지 파일을 서버에 전송하는 함수
    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files === null) return;
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileInputRef.current!.name);

      try {
        await axios.post (`/users/${username}/upload`, formData, {
          headers: {"Content-Type": "multipart/form-data"},
        });
        window.location.reload();
      } catch (error:any) {
          console.log(error);
      }
    }

    // 프로필 사진을 클릭하면 파일 선택 상자를 여는 함수
    const openFileInput = (type: string) => {
      if (!ownProfile) return;
      const fileInput = fileInputRef.current;
      if(fileInput) {
        fileInput.name = type;
        fileInput.click();
      }
    }
      // ==========사진 올리기용 끝!!==========

      
    //데이터가 아직 안들어왔으면 로딩 띄우기
    if (!userData) return( <div> Loading
        </div>);

    return (
      
      <div style={{height:"100vh", overflow:"auto"}}>
        <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage}/>
        <div className="card">
        {/* 프로필 사진 */}
        {userData.user.profileUrl && (
          <Image
          src = {userData.user.profileUrl}
          alt = "프로필 사진"
          width={70}
          height = {70}
          className='rounded-circle ms-3 mt-3'
          onClick={() => openFileInput("profile")}
          />
        )}
        
        <div className="card-body">
          <h5 className="card-title">{userData.user.nickname}</h5>
          <p className="card-subtitle text-muted">@{userData.user.username}</p>
          <p className='card-text mt-3'>자기소개</p>
          <p> {dayjs(userData.user.createdAt).format("YYYY.MM.DD")} 가입</p>
        </div>
      </div>

      <ul className="nav nav-tabs">
      <li className="nav-item">
        <a
          className={`nav-link ${activeTab === 'tweets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tweets')}
          href="#tweets">
          Tweets
        </a>
      </li>
      <li className="nav-item">
        <a
          className={`nav-link ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
          href="#likes">
          Likes
        </a>
      </li>
    </ul>
    <div className="tab-content">
      <div className={`tab-pane fade show ${activeTab === 'tweets' ? 'active' : ''}`} id="tweets">
        {/* 자신의 트윗 모음 */}
        {userData.userData.map((userData:any) => {
          if (userData.type === "Tweet") {
            const tweet:Tweet = userData;
            return <TweetCard key={tweet.identifier} tweet={tweet}/>
          }
        })}
      </div>
      <div className={`tab-pane fade show ${activeTab === 'likes' ? 'active' : ''}`} id="likes">
        {/* 자신의 좋아요 모음 */}
        {likesData?.map((tweet: Tweet) => {
          return <TweetCard key={tweet.identifier} tweet={tweet}/>
        })}
      </div>
    </div>
  </div>
  )}


export default UserPage
