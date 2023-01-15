import "./App.css";
import { useThemeContext } from "./context/ThemeContext";
import LoginPage from "./pages/Login";

function App() {
  const { handleThemeSwitch } = useThemeContext();

  return (
    <div>
      <button
        className="bg-green-200 p-4 rounded-3xl"
        onClick={handleThemeSwitch}
      >
        Dark Mode
      </button>
      <section className="antialiased h-screen bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center ">
        <LoginPage />
      </section>

      {/* <HomePage /> */}
    </div>
  );
}

export default App;
