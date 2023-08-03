import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import InputGroup from "@/components/InputGroup";
import Link from "next/link";
import { useAuth } from "@/context/auth";

const Login = () => {
  let router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  const { login } = useAuth();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login(username, password);
    } catch (error: any) {
      console.log(error, "로그인 오류");
      setErrors(error.response.data || {});
    }
  };

  return (
    <div className="bg-light bg-gradient py-5">
      <div
        className="row justify-content-center align-items-center text-center"
        style={{ height: "80vh" }}
      >
        <div className="card" style={{ width: "26rem" }}>
          <div className="card-body">
            <h4 className="card-title mb-3">로그인</h4>
            <form onSubmit={handleLogin}>
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
                type="password" //자동으로 암호처리되게함
                error={errors.password}
              />

              <div className="d-grid gap-2 mb-2">
                <button className="btn btn-primary">로그인 하기</button>
              </div>
            </form>

            <small>
              아직 가입하지 않았나요?
              <Link href="/register">
                <span className="m1-1 text-blue-500 uppercase ms-1">
                  회원가입
                </span>
              </Link>
            </small>
            <div>
              <small>
                로그인 없이 계속하고 싶다면
                <Link href="/">
                  <span className="m1-1 text-blue-500 uppercase ms-1">
                    홈으로
                  </span>
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
