import { useState } from "react";
import "../App.css";
import Records from "./Records.jsx";
import { useNavigate } from "react-router-dom";

//関数を実行
function Home() {
  //初期値をToDoに設定
  const [activeTab, setActiveTab] = useState("To Do"); //状態管理を設定して、初期値を"ToDo"にする
  const navigate = useNavigate();

  //表示する中身
  return (
    // アプリを包むコンテナ
    <div className="app-container">
      <div className="sidebar">
        <h1>タスク管理アプリ</h1>

        {/* メニューボタン */}
        <button
          className={`sidebar-button ${activeTab === "To Do" ? "active" : ""}`}
          onClick={() => setActiveTab("To Do")}
        >
          To Do
        </button>

        <button
          className={`sidebar-button ${
            activeTab === "Records" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Records")}
        >
          Records
        </button>

        <button
          className="sidebar-button"
          onClick={() => navigate("/post")}
        >
          Post
        </button>
      </div>

      {/* 選ばれるタブ */}
      <div className="main-content">
        {activeTab === "To Do" && <h2>ToDo list</h2>}
        {activeTab === "Records" && (
          <>
            <h2>Records</h2>
            <Records />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
