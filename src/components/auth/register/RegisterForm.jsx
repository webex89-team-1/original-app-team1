import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/firebase";
import { FormItem } from "@/src/components/ui/form-item/FormItem";
import "./RegisterForm.css";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("登録が完了しました");
      navigate("/list");
    } catch (error) {
      alert("メールアドレスまたはパスワードが間違っています");
    }
  };

  return (
    <div className="register-form">
      <div className="register-form-header">新規登録</div>

      <form onSubmit={handleSubmit}>
        <div className="register-form-form">
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
          <button type="submit" className="register-form-button">
            新規登録
          </button>
        </div>
      </form>
      <div className="register-form-or-text">
        アカウントをお持ちの方は
        <Link to="/login" className="register-form-or-link">
          ログイン
        </Link>
      </div>
    </div>
  );
}
