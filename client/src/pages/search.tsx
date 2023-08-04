import TweetCard from "@/components/TweetCard";
import { Tweet } from "@/types";
import axios from "axios";
import React, { FormEvent, useState } from "react";
import { Search } from "react-bootstrap-icons";

const SearchPage = () => {
  const [useSearch, setUseSearch] = useState("");
  const [results, setResults] = useState<Tweet[]>([]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.get("/posts/search", {
        params: { term: useSearch },
      });

      setResults(data.results);
    } catch (error) {
      console.log(error, "검색 클라이언트 에러");
    }
  };

  return (
    <div className="mt-5">
      {/* 검색창 */}
      <form onSubmit={handleSearch}>
        <div className="input-group input-group-lg mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="검색하기... 유저 검색시 @로 시작..."
            aria-label="searching"
            aria-describedby="button-addon2"
            value={useSearch}
            onChange={(e) => setUseSearch(e.target.value)}
          />
          <button className="btn btn-outline-secondary" id="button-addon2">
            <Search width="30" height="30" fill="black" />
          </button>
        </div>
      </form>

      <div>
        {/* 검색해서 나온 트윗들 나열 */}
        {results.map((tweet) => (
          <TweetCard key={tweet.identifier} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
