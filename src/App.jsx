import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./App.css";

function App() {
  const [showpwd, setShowpwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      // Firebase Auth でログイン
      await signInWithEmailAndPassword(auth, email, password);

      // Firestore にログイン履歴を記録
      await addDoc(collection(db, "users"), {
        email,
        loginAt: new Date(),
      });

      navigate("/home"); // ホーム画面へ遷移
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("ユーザーが見つかりません");
      } else if (err.code === "auth/wrong-password") {
        setError("パスワードが間違っています");
      } else if (err.code === "auth/invalid-credential") {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* 左側のブランドパネル */}
        <div className="brand-panel">
          <div className="logo"></div>
          <h1>TaskManager</h1>
        </div>

        {/* 右側のフォームパネル */}
        <div className="form-panel">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>
                メールアドレス:
                <input type="email" name="username" required />
              </label>
            </div>

            <div className="form-group">
              <label>パスワード:</label>
              <div className="password-input-container">
                <input
                  type={showpwd ? "text" : "password"}
                  name="password"
                  required
                />
                <button type="button" onClick={() => setShowpwd(!showpwd)}>
                  {showpwd ? "非表示" : "表示"}
                </button>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "読み込み中..." : "ログイン"}
            </button>

            <p className="signup-link">
              アカウントをお持ちでないですか？{" "}
              <Link to="/register">新規登録</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
