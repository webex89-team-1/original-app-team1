import react from "react";
import { useNavigate } from "react-router-dom";
import { getfirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import './App.css'; 
const db = getfirestore();
const querySnapshot = await getDocs(collection(db, "users"));


function Check() {
  const navigate = useNavigate();
  const [loasding, setLoading] = react.useState(true)
  
  async function fetchData() {

  }



  return (
    <div classname="login-container">
      <div classname = "brand-panel">
        <divclassname = "logo">
            <div classname = "logo-shape"></div>
        </div>
        <h1>TaskManager</h1>
        <p>確認画面</p>
      </div>
      <div classname = "form-panel">
        <h2>Check Page</h2>
        <ul>
            {querySnapshot.docs.map((doc) => (
            <li key={doc.id}>{doc.data().email})
            )}</ul>
      <button onClick={() => navigate("/home")}>Go to Register</button>
    </div>

  );
};
export default Check;