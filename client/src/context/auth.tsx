import {User} from "@/types"
import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";

interface State {
    authenticated: boolean; //로그인 상태
    user: User | undefined; //로그인한 사용자의 정보
    loading: boolean; //로딩 중 여부
} //애플리케이션의 상태를 나타내는 객체의 형태를 정의

interface Action {
    type: string; //액션의 종류
    payload?: any; //액션에 따라 상태를 변경하는데 필요한 "추가 데이터"
}

const StateContext = createContext<State>({ //Context API 사용. 이 상태를 필요로하는 모든 컴포넌트에게 공유
    authenticated: false,
    user: undefined,
    loading: false
    });

const DispatchContext = createContext<any>(null);

const reducer = (state: State, {type, payload}: Action) => {
    switch (type){
        case "LOGIN":
            return {
              ...state,
                authenticated: true,
                user: payload
            }
        case "LOGOUT":
            return {
              ...state,
                authenticated: false,
                user: null
            }
        case "STOP_LOADING":
            return {
                ...state,
                loading: false
            }
        default:
            throw new Error(`unhandled action type: ${type}`);
    }
}
    

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [state, defaultDispatch] = useReducer(reducer, {
        user:null,
        authenticated: false,
        loading: true}); //첫번째 인자: reducer, 두번째 인자: initial state
        
    
    const dispatch = (type: string, payload?: any) => {
        defaultDispatch({type, payload});
    }

    

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await axios.get("/auth/me");
                dispatch("LOGIN", res.data);
            } catch (error) {
                console.log(error);
            } finally {
                dispatch("STOP_LOADING");
            }
        }
        loadUser();
    }, [])

    return (<DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
            {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )

};

    export const useAuthState = () => {
        return useContext(StateContext);
    }
    export const useAuthDispatch = () => {
    return useContext(DispatchContext);
    }