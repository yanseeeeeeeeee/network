import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";


export default function Home() {

    const navigate = useNavigate();
    const user = auth.currentUser;

    const logout = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        alert(error.message);
      }
    };

    return (
        <div className="container">

            <div className="card">

                <h2>Главная</h2>
                <p>Вы вошли как:</p>
                <p>
                    <strong>{user?.email}</strong>
                </p>

                <button onClick={logout}>
                    Выйти
                </button>

            </div>

        </div>
    );
}