import { Link } from "react-router-dom"; 
import React from "react"; 
//import { useState } from "react";
import {collection, addDoc} from "firebase/firestore";
import {db, auth} from "./firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";  
import { useNavigate } from "react-router-dom";
import './App.css';

//関数を実行
function App() {
  const [showpwd, setShowpwd] = React.useState(false);
  const[loading, setLoading] = React.useState(false);
  const[error, setError] = React.useState(null);


  const navigate = useNavigate();

  async function onSubmit(e) { //フォームの送信イベントを処理する非同期関数
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (loading) return; 
    if (error) setError(null); 
    if (!e.target.checkValidity()) {
      setError("フォームの入力が正しくありません");
      setLoading(false);
      return;
    }
    try { //ログイン処理を試みる
      const form = e.target;
      const formData = new FormData(form);
      const email = formData.get("username");
      const password = formData.get("password");
      await signInWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        email,loginAt: new Date()
      });
      navigate("/post");
      // ログイン成功後の処理
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("ユーザーが見つかりません");
      } else if (err.code === "auth/wrong-password") {
        setError("パスワードが間違っています");
      }else if (err.code === "auth/invalid-credential") {
        setError("メールアドレスまたはパスワードが正しくありません");
      }else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-container">
      <div className="brand-panel">
        <div className="logo">
          <div className="logo-shape"></div>
        </div>
        <h1>TaskManager</h1>
      </div>
      <div className="form-panel">
        <form onSubmit={onSubmit}>
          <div>
            <label>
              メールアドレス:
              <input type="email" name="username" required />
            </label>
          </div>
          <div className="form-group">
            <label>
              パスワード:
            </label>
            <div className= "password-input-container">
              <input type={showpwd ? "text" : "password"} name="password" required />
              <button type="button" onClick={() => setShowpwd(!showpwd)}>
                {showpwd ? "非表示" : "表示"}
              </button>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "読み込み中..." : "ログイン"}
          </button>
          <p className="signup-link">
            アカウントをお持ちでないですか？ <Link to="/register">新規登録</Link>
          </p>
        </form>
    </div>
  </div>
  );
}

export default App;
