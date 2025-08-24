import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./firebase.js" 
import App from "./App.jsx";
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import { Routes, Route } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
);
