import { Route, Routes } from "react-router-dom";
import App from "../App.jsx";
import Register from "../components/register/Register.jsx";
import Avatar from "../components/avatar/Avatar.jsx";
import Home from "../pages/home/Home.jsx";
import Post from "../components/post/Post.jsx";
import DailyTaskList from "../pages/DailyTaskList";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/avatar" element={<Avatar />} />
      <Route path="/home" element={<Home />} />
      <Route path="/post" element={<Post />} />
      <Route path="/daily-task-list" element={<DailyTaskList />}/>
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
