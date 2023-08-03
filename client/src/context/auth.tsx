import { User } from "@/types";
import axios from "axios";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

// State 관리를 위한 객체의 형태 정의
interface AuthContextProps {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>; //완료될때 어떠한 값을 반환하지 않는다는 뜻
  logout: () => Promise<void>;
}

// 인증 상태를 관리하기 위한 Context 생성
const AuthContext = createContext<AuthContextProps>({
  authenticated: false,
  user: undefined,
  loading: false,
  login: async () => {}, //더미 함수
  logout: async () => {},
});

// 인증 상태를 관리하고 하위 컴포넌트에 전달하는 역할을 하는 컴포넌트
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  // 인증 상태, 사용자 정보, 로딩 상태를 관리하는 상태 변수 선언
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 마운트 될 때 사용자 정보를 가져와 상태를 initialize 하는 코드
  // 마운트? 리액트에서 특정 컴포넌트가 DOM에 처음으로 삽입되는 과정을 의미!
  useEffect(() => {
    //컴포넌트의 라이프사이클에서 특정 시점에 작업을 수행하게 해줌. 여기서는 두번째 인자로
    //빈 배열 '[]'을 전달해줬는데, 이건 컴포넌트가 마운트되는 시점에만 내부의 코드를 실행하라는 뜻
    async function loadUser() {
      try {
        // 서버에서 /auth/me 경로로 GET 요청을 보내, 로그인된 사용자의 정보를 불러옴
        const res = await axios.get("/auth/me");
        setUser(res.data); //윗줄에서 불러온 사용자의 정보를 상태로 설정하고
        setAuthenticated(true); // 인증 상태를 true로 설정
      } catch (error) {
        console.log(error); //오류가 발생하면 실행되는 부분
      } finally {
        //무조건 오류 여부와 상관없이 무조건 실행되는 코드. 즉, loading은 무조건 false로 세팅
        setLoading(false);
      }
    }
    loadUser(); //선언한 loadUser 함수를 호출하여 사용자 정보를 불러오는 작업을 시작
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      setUser(res.data?.user); //user 상태(state)에 현재 유저의 정보를 저장
      setAuthenticated(true); //로그인 인증이 됐다고 true 처리

      router.push("/");
    } catch (error) {
      console.log(error, "로그인 오류");
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(undefined);
      setAuthenticated(false);
    } catch (error) {
      console.log(error, "로그아웃 오류");
    }
  };

  //   하위 컴포넌트{children}에 authenticated, user, loading의 State를 전달하는 역할을 함
  return (
    <>
      <AuthContext.Provider
        value={{ authenticated, user, loading, login, logout }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

// 커스텀 훅 생성
//AuthContext는 그냥 createContext를 통해 생성된 State의 컨테이너 같은거고, useContext를 이용해서
//사용을 하겠다고 호출을 해야함.
//꼭 useAuth의 형태로 커스텀 훅을 만들 필요는 없지만, useContext()의 형태로 매번 호출을 해야하니까
//그냥 더 보기 좋게 useAuth로 선언...
export const useAuth = () => {
  return useContext(AuthContext);
};
