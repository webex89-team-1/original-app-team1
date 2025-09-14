import react from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

function Avatar() {
  const Picture_Avatar = [
    { id: 1, image: "./images/avatar1.png" }, //↓ここに画像のパスを入れる
    { id: 2, image: "./images/avatar2.png" },
    { id: 3, image: "./images/avatar3.png" },
    { id: 4, image: "./images/avatar4.png" },
    { id: 5, image: "./images/avatar5.png" },
    { id: 6, image: "./images/avatar6.png" },
    { id: 7, image: "./images/avatar7.png" },
    { id: 8, image: "./images/avatar8.png" },
    { id: 9, image: "./images/avatar9.png" },
  ];
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = react.useState(null); //選択されたアバターを保存するための状態
  const [Loading, setLoading] = react.useState(false); //ローディング状態を管理するための状態

  async function DatabaseFunction() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        await updateProfile(user, {
          photoURL: `./images/avatar${selectedAvatar}.png`, //選択されたアバターの画像パスを設定
        });
        const db = getFirestore();
        await setDoc(
          doc(db, "users", user.uid),
          {
            avatar: selectedAvatar,
          },
          { merge: true }
        );
        navigate("/home");
      } catch (error) {
        console.error("アバター選択の更新に失敗しました：", error);
        alert("アバター選択の更新に失敗しました。もう一度お試しください。");
      } finally {
        setLoading(false);
      }
    } else {
      navigate("/login");
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
        <div className="Avater-panel">
          <h2>お好きなアバターを選択してください</h2>
          <div className="avatar-list">
            {Picture_Avatar.map((avatar) => (
              <img
                key={avatar.id}
                src={avatar.image}
                alt={`Avatar ${avatar.id}`}
                className={`avatar-image ${
                  selectedAvatar === avatar.id ? "selected" : ""
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              />
            ))}
          </div>
          <button
            className="submit-button"
            onClick={DatabaseFunction}
            disabled={Loading || selectedAvatar === null}
          >
            {Loading ? "Loading..." : "選択完了"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Avatar;
