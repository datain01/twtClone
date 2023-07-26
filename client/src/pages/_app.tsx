import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app'
import Axios from 'axios'
import { AuthProvider } from '@/context/auth';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import axios from 'axios';
import {SWRConfig} from 'swr'

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true; //모든 axios에 withCredentials 설정

  const {pathname} = useRouter(); //현재 페이지의 경로 정보를 포함하는 router 객체 반환
  //{pathname}은 router 객체에서 pathname 속성을 추출하여 현재 페이지의 경로를 나타냄
  const authRoutes = ['/login', '/register']; //로그인, 회원가입 경로를 배열로 저장
  const authRoute = authRoutes.includes(pathname); //이 배열이 pathname을 포함하고 있는지 확인.
  //즉, 현재 페이지가 로그인이나 회원가입 페이지인지 확인한 뒤 로그인/회원가입 페이지면 true 반환

  
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error:any) {
      throw error.response.data
    }
  }



  return (
  <SWRConfig
    value={{
      fetcher
    }}
    >
    <AuthProvider>
      {/* login, register 페이지가 아니면 NavBar를 보여주고, 좌측에 9(3rem)의 공백을 띄움 */}
      <div className={`d-flex ${authRoute ? '' : 'vh-100'}`}>
          {!authRoute && <NavBar />}
          <div className="flex-grow-1">
            <Component {...pageProps} />
          </div>
        </div>    
    </AuthProvider>
  </SWRConfig>
  )
}
