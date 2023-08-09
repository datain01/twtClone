import { createContext, useContext } from "react";
import { useState } from "react";

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode는 DarkModeProvider와 쓰여야 합니다.");
  }
  return context;
};

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

// 새로운 훅
export const useDarkModeClassNames = (
  classes = {
    darkBg: "bg-dark",
    darkText: "text-light",
    lightBg: "bg-light",
    lightText: "text-dark",
  }
) => {
  const { isDarkMode } = useDarkMode();

  return isDarkMode
    ? `${classes.darkBg} ${classes.darkText}`
    : `${classes.lightBg} ${classes.lightText}`;
};
