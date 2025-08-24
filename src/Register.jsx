import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    const email = formData.get("username");
    const password = formData.get("password");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>新規登録</h1>
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
            <input type="password" name="password" required />
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}

export default Register;