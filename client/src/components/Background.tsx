import { useDarkMode } from "@/context/darkmode";

const BackgroundComponent: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  if (!isDarkMode) return null;

  return (
    <div
      className="bg-dark"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default BackgroundComponent;
