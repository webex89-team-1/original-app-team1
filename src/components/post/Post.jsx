import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import "../../App.css";
function Post() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // Renamed for consistency

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsCol = collection(db, "posts");
        const q = query(postsCol, orderBy("createdAt", "desc"));
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsList);
      } catch (err) {
        setError("投稿の取得に失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  const handleAddPost = async () => {
    if (!title.trim() || !content.trim()) {
      setError("タイトルと内容を入力してください");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: title,
        content: content,
        createdAt: serverTimestamp(),
      });
      const newPost = {
        id: docRef.id,
        title,
        content,
        createdAt: { seconds: Date.now() / 1000 },
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError("投稿の追加に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      if (sortOrder === "asc") {
        return dateA - dateB;
      }
      return dateB - dateA; // desc is the default
    });
  }, [posts, sortOrder]);

  return (
    <div className="home-container">
      <div className="tab-panel">
        <div className="profile-panel">
          <button onClick={() => navigate("/profile")}>Go to Profile</button>
        </div>
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/stopwatch")}>Stopwatch</button>
        <button onClick={() => navigate("/post")}>Post</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={() => navigate("/")}>Logout</button>
      </div>
      <div className="post-panel">
        <h2>Posts</h2>
        <div className="post-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトル"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="内容"
          ></textarea>
          <button onClick={handleAddPost} disabled={loading}>
            {loading ? "投稿中..." : "投稿"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">降順</option>
          <option value="asc">昇順</option>
        </select>
        {loading && posts.length === 0 && <p>読み込み中...</p>}
        <ul>
          {sortedPosts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Post;
