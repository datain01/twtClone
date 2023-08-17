import { createContext, useContext } from "react";
import { useState } from "react";

interface DarkModeContextProps {
  isDarkMode: boolean; //다크모드의 상태
  toggleDarkMode: () => void; //상태를 전환하는 함수
}

//다른 컴포넌트들에서도 사용할 수 있도록 context를 생성
const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);

//현재의 다크 모드 상태와 그 상태를 변경하는 함수 제공
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode는 DarkModeProvider와 쓰여야 합니다.");
  }
  return context;
};

//앱의 루트에서 이 provider를 사용해서 자식 컴포넌트들이 다크 모드 관련 정보에 접근할 수 있도록함
//isDarkMode의 상태와 toggleDarkMode 함수를 정의
//DarkModeContext.Provider를 통해 제공
export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

//커스텀 훅
export const useDarkModeClassNames = () => {
  const { isDarkMode } = useDarkMode();

  return {
    backgroundClass: isDarkMode ? "bg-dark" : "bg-white",
    textClass: isDarkMode ? "text-light" : "text-dark",
    mutedTextClass: isDarkMode ? "text-muted-dark" : "text-muted",
    btnClass: isDarkMode ? "btn-outline-light" : "btn-outline-secondary",
    inputClass: isDarkMode ? "input-dark" : "input-light",
  };
};
