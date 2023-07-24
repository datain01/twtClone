import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import axios from 'axios'
import InputGroup from '@/components/InputGroup';
import Link from 'next/link';
import { useAuthDispatch } from '@/context/auth';

const Login = () => {
    let router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const dispatch = useAuthDispatch();

    const handleSubmit = async (event: FormEvent) => { 
        //폼 제출 이벤트를 처리하는 비동기 함수
        event.preventDefault(); //폼 제출에 의한 새로고침 방지
        try {
            const res = await axios.post ('/auth/login', {
                //axios.post를 이용해 POST 요청 보냄
                //axios를 통해 클라이언트와 서버 간의 통신 가능
                password,
                username,
            },
            {
                withCredentials: true
            }            )
            dispatch("LOGIN", res.data?.user)
            console.log('res', res);
            router.push("/");
        } catch (error:any) {
            console.log('error', error);
            setErrors(error.response.data || {});
        }
    }

  return (
    <div className="bg-light bg-gradient py-5">
        <div className="row justify-content-center align-items-center text-center" style={{height: '80vh'}}>
            <div className="card" style={{width: '26rem'}}>
                <div className="card-body">
                    <h4 className="card-title mb-3">로그인</h4>           
                    <form onSubmit = {handleSubmit}>
                        
                        <InputGroup
                        placeholder="Username"
                        value={username}
                        setValue={setUsername}
                        error={errors.username}
                        />
                        <InputGroup
                        placeholder="Password"
                        value={password}
                        setValue={setPassword}
                        error={errors.password}
                        />
                        
                        <div className="d-grid gap-2 mb-2">
                            <button className="btn btn-primary">로그인 하기</button>
                        </div>
                    </form>
                    
                    <small>
                        아직 가입하지 않았나요?
                        <Link href="/login">
                            <span className="m1-1 text-blue-500 uppercase">회원가입</span>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
