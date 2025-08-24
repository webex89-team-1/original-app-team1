import { Link } from "react-router-dom";
import React from "react"; 
import { useState } from "react";
import {collection, addDoc} from "firebase/firestore";
import {db, auth} from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


function App() {
  const [showpwd, setShowpwd] = React.useState(false);
  const[loading, setLoading] = React.useState(false);
  const[error, setError] = React.useState(null);
  const[data, setData] = useState([])
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (loading) return; // 多重送信防止
    if (error) setError(null); // エラーリセット
    if (!e.target.checkValidity()) {
      setError("フォームの入力が正しくありません");
      setLoading(false);
      return;
    }
    try {
      const form = e.target;
      const formData = new FormData(form);
      const email = formData.get("username");
      const password = formData.get("password");
      await signInWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        email,loginAt: new Date()
      });
      navigate("/home");
      // ログイン成功後の処理（例: トークンの保存、リダイレクトなど）
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
    <div>
      <h1>ログイン</h1>
      <p>メールアドレスとパスワードを入力してください</p>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            メールアドレス:
            <input type="email" name="username" required />
          </label>
        </div>
        <div>
          <label>
            パスワード:
            <input type={showpwd ? "text" : "password"} name="password" required />
          </label>
          <button type="button" onClick={() => setShowpwd(!showpwd)}>
            {showpwd ? "非表示" : "表示"}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "読み込み中..." : "ログイン"}
        </button>
      </form>
      <p>
        アカウントをお持ちでないですか？ <Link to="/register">新規登録</Link>
      </p>
    </div>
  );
}
export default App;
