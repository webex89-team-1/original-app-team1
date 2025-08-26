import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/firebase";
import { FormItem } from "@/src/components/ui/form-item/FormItem";
import "./LoginForm.css";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("ログインが完了しました");
      navigate("/list");
    } catch (error) {
      alert("メールアドレスまたはパスワードが間違っています");
    }
  };

  return (
    <div className="login-form">
      <div className="login-form-header">ログイン</div>

      <form onSubmit={handleSubmit}>
        <div className="login-form-form">
          <FormItem
            label="メールアドレス"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormItem
            label="パスワード"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-form-button">
            ログイン
          </button>
        </div>
      </form>
      <div className="login-form-or-text">
        アカウントをお持ちでない方は
        <Link to="/register" className="login-form-or-link">
          こちら
        </Link>
      </div>
    </div>
  );
}
