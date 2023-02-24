import ThemeSwitcher from "./components/ThemeSwitcher";
import "react-datepicker/dist/react-datepicker.css";

import Routers from "./Routes";

function App() {
  return (
    <section className="app">
      <ThemeSwitcher />
      <Routers />
    </section>
  );
}

export default App;
