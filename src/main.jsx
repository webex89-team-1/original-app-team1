import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./firebase.js" 
import Router from "./routes/route.jsx";


const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
