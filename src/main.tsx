
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { FilterProvider } from "./app/contexts/FilterContext";
import { MemeifyProvider } from "./app/contexts/MemeifyContext";
import "./styles/index.css";

const savedTheme = window.localStorage.getItem("apex-stats-theme");
document.documentElement.classList.toggle("dark", savedTheme ? savedTheme === "dark" : true);

createRoot(document.getElementById("root")!).render(
  <MemeifyProvider>
    <FilterProvider>
      <App />
    </FilterProvider>
  </MemeifyProvider>
);
  