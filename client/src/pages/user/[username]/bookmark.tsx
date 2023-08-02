import TweetCard from '@/components/TweetCard';
import { Tweet } from '@/types';
import axios from 'axios';
import React, { FormEvent, useState } from 'react'

const Bookmark = () => {
    const [useBookmark, setUseBookmark] = useState("");
    const [results, setResults] = useState<Tweet[]>([]);

    const handleBookmark = async (e: FormEvent) => {
        e.preventDefault();

        try {
        const {data} = await axios.get("/posts/bookmark", {
            params: {term: useBookmark}
        })

        setResults(data.results);
        } catch (error) {
        console.log(error, "검색 클라이언트 에러");
        }
    }

    return (
        <div style={{height:"100vh", overflow:"auto"}}>
        북마크
        <div>
            {/* 검색해서 나온 트윗들 나열 */}
            {results.map((tweet) =>(
            <TweetCard key={tweet.identifier} tweet={tweet}/>
            ))}
        </div>
        </div>
    )
}

export default Bookmark
