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

export const useDarkModeClassNames = () => {
  const { isDarkMode } = useDarkMode();

  return {
    backgroundClass: isDarkMode ? "bg-dark" : "bg-light",
    textClass: isDarkMode ? "text-light" : "text-dark",
    mutedTextClass: isDarkMode ? "text-muted-dark" : "text-muted",
    btnClass: isDarkMode ? "btn-outline-light" : "btn-outline-secondary",
    inputClass: isDarkMode ? "input-dark" : "input-light",
  };
};
