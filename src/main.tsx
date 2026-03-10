
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { FilterProvider } from "./app/contexts/FilterContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <FilterProvider>
    <App />
  </FilterProvider>
);
  