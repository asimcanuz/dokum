import React from "react";
import { useThemeContext } from "../../context/ThemeContext";

function HomePage() {
  const { handleThemeSwitch } = useThemeContext();
  return (
    <div>
      <div className="h-screen bg-white dark:bg-black flex justify-center items-center">
        <button
          className="bg-green-200 p-4 rounded-3xl"
          onClick={handleThemeSwitch}
        >
          Dark Mode
        </button>
      </div>
    </div>
  );
}

export default HomePage;
