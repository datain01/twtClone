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
    const {data, error} = useSWR<any>(username ? `/users/${username}`: null);

    // ==========사진 올리기용 시작!!==========
    const [ownProfile, setOwnProfile] = useState(false);
    const {authenticated, user} = useAuthState();

    // 숨겨진 파일 입력 요소에 대한 참조를 저장 
    const fileInputRef = useRef<HTMLInputElement>(null); 
    
    useEffect(() => { //자신의 프로필만 수정가능
        if (!data) return;
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
    if (!data) return( <div> Loading
        </div>);

    return (
      
      <div style={{height:"100vh", overflow:"auto"}}>
        <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage}/>
        <div className="card">
        {/* 프로필 사진 */}
        {data.user.profileUrl && (
          <Image
          src = {data.user.profileUrl}
          alt = "프로필 사진"
          width={70}
          height = {70}
          className='rounded-circle ms-3 mt-3'
          onClick={() => openFileInput("profile")}
          />
        )}
        
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
