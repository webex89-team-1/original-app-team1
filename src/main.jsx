import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Router from "./routes/route.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
