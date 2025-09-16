import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './App.css';

function Check() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleConfirm = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="brand-panel">
          <div className="logo"><div className="logo-shape"></div></div>
          <h1>TaskManager</h1>
        </div>
        <div className="form-panel"><p>読み込み中...</p></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="brand-panel">
        <div className="logo">
            <div className="logo-shape"></div>
        </div>
        <h1>タスク管理</h1>
        <p>登録内容の確認</p>
      </div>
      <div className="form-panel">
        <div className="check-panel">
          <h2>以下の内容で登録します</h2>
          <div className="check-avatar-container">
            <img src={user?.photoURL || '/images/avatar-placeholder.png'} alt="Avatar" className="avatar-image-large" onError={(e) => { e.target.onerror = null; e.target.src='/images/avatar-placeholder.png'; }}/>
          </div>
          <p className="check-username">{user?.displayName || "名前が設定されていません"}</p>
          <button className="submit-button" onClick={handleConfirm}>
            登録完了
          </button>
        </div>
      </div>
    </div>
  );
};
export default Check;