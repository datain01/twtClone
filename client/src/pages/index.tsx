import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import InputGroup from '../components/InputGroup'
import { NextPage } from 'next'
import { useAuthState } from '@/context/auth'
import { Tweet } from '@/types'
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import TweetCard from '@/components/TweetCard'
import { useEffect, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

const Home: NextPage = () => {

  //ref가 펜이라면 useRef는 메모종이. scrollContainer는 ref를 이용해서 주소를 메모에 기록해둔거임...
  const scrollContainer = useRef(null); //특정 스크롤 컨테이너의 주소를 기록하고 그 컨테이너의 DOM 요소에 접근할 수 있음
  const observedElementRef = useRef(null); //특정 엘리먼트의 주소를 기록. 여기서는 tweetCard가 그 엘리먼트

  const getKey = (pageIndex:number, previousPageData: Tweet[]) => { 
    if (previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  }


  const {
    data, //각 페이지의 가져오기 응답 값의 배열
    error, //useSWR의 error
    size: page, //가져올 페이지와 반환될 페이지의 수
    setSize: setPage, //가져와야하는 페이지의 수 설정
    isValidating, //useSWR의 isValidating
    mutate
  } = useSWRInfinite<Tweet[]>(getKey);
  //getKey: 각 페이지에 고유한 키를 생성하는 역할을 하는 useSWRInfinite에서 쓰이는 함수
  //이 키는 각 페이지의 데이터를 가져오는 데 사용되는 API 엔드포인트를 결정하는 데 사용됨

  const isInitialLoading = !data && !error; //초기 로딩 상태를 확인. data, error가 모두 없으면 true가 됨.
  //로딩 스피너, 로딩 표시 등을 보여주는 사용할 수 있음.

  const tweets: Tweet[] = data ? ([] as Tweet[]).concat(...data): [];
  //모든 페이지의 트윗 데이터를 단일 배열로 합침
  //data가 존재하면 빈 배열 ([] as Tweet[])에 data의 모든 요소를 연결함(concat)

  // 스크롤을 내려서 observedPost에 닿으면 다음 페이지 포스트들을 가져오기 위한 포스트 id state
  const [observedTweet, setObservedTweet] = useState("");

  useEffect(() => {
    // 포스트가 없으면 바로 return
    if (!tweets || tweets.length === 0) return;

    // tweets 배열에서 마지막 tweet id를 가져옴
    const id = tweets[tweets.length - 1].identifier;

    // tweets 배열에 tweet이 추가돼서 마지막 tweet이 바뀌면, 바뀐 tweet중 마지막을 observedPost로 대체
    if (id !== observedTweet) {
      setObservedTweet(id);
      observeElement(observedElementRef.current);
    }

  }, [tweets]);

  const observeElement = (element: HTMLElement | null) => { 
    //HTMLElement: 웹 페이지의 각 요소를 나타내는 객체 (<div>, <span> 등의 태그가 있다면, 각각이 HTMLElement 객체로 표현됨)
    // console.log('Observing element:', element);
    if (!element) return;

    //IntersectionObserver: 자바스크립트 API. 특정 html 요소 (element)가 뷰포트와 교차하는지 감시
    const observer = new IntersectionObserver(//첫번째 매개변수: 콜백함수. 관찰 대상 요소가 뷰포트와 교차할때마다 호출
      (entries) => {
        if (entries[0].isIntersecting === true) { //entries[0].isIntersecting이 속성을 확인, 요소가 뷰포트와 교차하는지 확인함.
          //true가 되면 콘솔에 메시지 출력 후 page 상태를 증가
          // console.log("마지막 포스트");
          setPage(page + 1);
          observer.unobserve(element); //요소에 대한 관찰 중지
        }
      },
      {root: scrollContainer.current, threshold: 0.5} //두번째 매개변수: 옵션 객체. threshold는 교차영역 비율을 뜻함 (0.0~1.0).
      // 1은 요소의 전체 영역이 뷰포트와 교차했을때 콜백함수를 호출하도록함
    );
      observer.observe(element) //를 호출하여 요소에 대한 관찰 시작
  }

  return (
    <div ref={scrollContainer} style={{height:"100vh", overflow:"auto", background:"light"}}>
      {isInitialLoading && <p className='text-lg text-center'>Loading...</p>}
      {tweets?.map((tweet, index)=>(
        <TweetCard
        tweet={tweet}
        key={tweet.identifier}
        innerRef={index === tweets.length - 1 ? observedElementRef:null}
        mutate={mutate}
        />
      ))}
      {isValidating && tweets.length > 0 && (
        <p className='text-lg text-center'>Loading More...</p>
      )}
    </div>
     
  )
}

export default Home;
