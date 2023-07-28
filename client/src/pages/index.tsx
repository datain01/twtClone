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

const inter = Inter({ subsets: ['latin'] })

const Home: NextPage = () => {
  const {authenticated} = useAuthState();

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

  return (
    <div>
      {isInitialLoading && <p className='text-lg text-center'>Loading...</p>}
      {tweets?.map((tweet)=>(
        <TweetCard
        post={tweet}
        key={tweet.identifier}
        mutate={mutate}
        // swr을 넘겨줘야함...
        />
      ))}
      {isValidating && tweets.length > 0 && (
        <p className='text-lg text-center'>Loading More...</p>
      )}
    </div>
     

  
  )
}

export default Home;
