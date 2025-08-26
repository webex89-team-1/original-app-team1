import { Route, Routes } from "react-router";
import App from "@/src/App.jsx";
import Login from "@/src/pages/auth/login/Login.jsx";
import Register from "@/src/pages/auth/register/Register.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
