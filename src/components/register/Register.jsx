import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../App.css";

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showpwd, setShowpwd] = React.useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("パスワードと確認用パスワードが一致しません");
      setLoading(false);
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/avatar");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("このメールアドレスは既に使用されています");
      } else if (err.code === "auth/invalid-email") {
        setError("無効なメールアドレスです");
      } else if (err.code === "auth/weak-password") {
        setError("パスワードは6文字以上である必要があります");
      } else {
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
        <p>新規アカウント登録</p>
      </div>

      <div className="form-panel">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>名前:</label>
            <input type="text" name="name" required />
          </div>
          <div className="form-group">
            <label>
              メールアドレス:
              <input type="email" name="email" required />
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
          <div className="form-group">
            <label>確認用パスワード:</label>
            <div className="password-input-container">
              <input
                type={showConfirmPwd ? "text" : "password"}
                name="confirmPassword"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                {showConfirmPwd ? "非表示" : "表示"}
              </button>
            </div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "登録中..." : "登録"}
          </button>
          <p className="signup-link">
            既にアカウントをお持ちですか？ <a href="/">ログイン</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
