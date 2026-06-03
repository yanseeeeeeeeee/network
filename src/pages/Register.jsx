import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {

        if (!email.trim()) {
            alert("Введите email");
            return;
        }

        if (!password.trim()) {
            alert("Введите пароль");
            return;
        }

        if (password.length <6 ) {
            alert("Пароль должен содержать минимум 6 символов");
            return;
        }

        try{
             const userCreate = await createUserWithEmailAndPassword(auth, email,password);
             navigate("/home");
         } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("Пользователь уже существует");
                return;
            }

            if (error.code === "auth/invalid-email") {
                alert("Неккоректный email");
                return;
            }

            alert("Ошибка регистрации");
         }
    };

    return(
        <div className="container">
            <div className="card">
                <h2>Регистрация</h2>
                <input
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}/>

                <input 
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}/>

                <button onClick={handleRegister}>
                    Создать аккаунт
                </button>

                <p
                className="link"
                onClick={() => navigate("/")}>
                    Уже есть аккаунт? Войти
                </p>

            </div>
        </div>
    );
}