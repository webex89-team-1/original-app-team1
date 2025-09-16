import { Route, Routes } from "react-router-dom";
import App from "../App.jsx";
import Timeline from "../pages/Timeline.jsx";
import Search from "../pages/Search.jsx";
import Notification from "../pages/Notification.jsx";
import User from "../pages/User.jsx";
import Register from "../Register.jsx";
import Avatar from "../Avatar.jsx";
import Home from "../pages/Home.jsx"; // `src/pages/Home.jsx` をインポート
import Post from "../Post.jsx";
import Check from "../Check.jsx";

export default function Router() {
  return (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/register" element={<Register />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/check" element={<Check />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
  );
}
