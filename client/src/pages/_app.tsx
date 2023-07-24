import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app'
import Axios from 'axios'
import { AuthProvider } from '@/context/auth';

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true; //모든 axios에 withCredentials 설정
  

  return (<AuthProvider>
  <Component {...pageProps} />
  </AuthProvider>)
}
