import { Tweet } from '@/types';
import { useRouter } from 'next/router'
import React from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { ArrowRepeat, Bookmark, Chat, Heart } from 'react-bootstrap-icons';

const TweetPage = () => {
    const router = useRouter();
    const {identifier, slug} = router.query; //현재 URL의 쿼리 문자열 부분을 파싱하여 자바스크립트 객체로 제공

    const {data: post, error} = useSWR<Tweet> ( //data: 요청한 데이터
        identifier && slug ? `/posts/${identifier}/${slug}` : null
        //identifier와 slug가 없다면 null 반환
    );

  return (
    // 나중에 헤더 만들어서 넣고 카드는 없애자
    <div className="card"> 
        <div className="card-body">
            {post && post.user &&(
                <>
            <div className="d-flex">
            <Image src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="user" width="45" height="45" className='rounded-circle'/>
            <div className='mx-3'>
                <strong >{post.user.nickname}</strong>
                <p className="mb-0">@{post.user.username}</p>
            </div>
            </div>
            <p className="mt-2">{post.content}</p>
            <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-link text-muted">
                <Chat width="20" height="20" fill="grey" />
            </button>
            <button type="button" className="btn btn-link text-muted">
                <ArrowRepeat width="20" height="20" fill="grey" />
            </button>
            <button type="button" className="btn btn-link text-muted">
                <Heart width="20" height="20" fill="grey" />
            </button>
            <button type="button" className="btn btn-link text-muted">
                <Bookmark width="20" height="20" fill="grey" />
            </button>
            </div>
            </>
            )}
        </div>
    </div>

  )
}

export default TweetPage
