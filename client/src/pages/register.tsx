import InputGroup from "@/components/InputGroup"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react"

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [errors, setErrors] = useState<any>([]);
    
    // const {authenticated} = useAuthState();

    let router = useRouter(); 
    //nextJS의 useRouter 훅을 이용해서 페이지간의 이동 관리하는 객체 생성
    // if (authenticated) router.push("/");

    const handleSubmit = async (event: FormEvent) => { 
        //폼 제출 이벤트를 처리하는 비동기 함수
        event.preventDefault(); //폼 제출에 의한 새로고침 방지
        try {
            const res = await axios.post ('/auth/register', {
                //axios.post를 이용해 POST 요청 보냄
                //axios를 통해 클라이언트와 서버 간의 통신 가능
                email,
                password,
                username,
                nickname
            })
            console.log('res', res);
            router.push("/login");
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
                    <h4 className="card-title mb-3">회원가입</h4>           
                    <form onSubmit = {handleSubmit}>
                        <InputGroup
                        placeholder="Email"
                        value={email}
                        setValue={setEmail}
                        error={errors.email}
                        />
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
                        <InputGroup
                        placeholder="Nickname"
                        value={nickname}
                        setValue={setNickname}
                        error={errors.nickname}
                        />
                        <div className="d-grid gap-2 mb-2">
                            <button className="btn btn-primary">회원가입 하기</button>
                        </div>
                    </form>
                    
                    <small>
                        이미 가입하셨나요?
                        <Link href="/login">
                            <span className="m1-1 text-blue-500 uppercase ms-1">로그인</span>
                        </Link>
                    </small>
                    <div>
                        <small>
                            회원가입 없이 계속하고 싶다면
                            <Link href="/">
                                <span className="m1-1 text-blue-500 uppercase ms-1">홈으로</span>
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>


    )
}

export default Register;