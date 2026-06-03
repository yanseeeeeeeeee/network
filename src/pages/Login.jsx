import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; //преход между страницами
import { auth } from "../firebase";

export default function Login() {
    const [email, setEmail] = useState(""); //переменная для хранения состояния
    const[password, setPassword] = useState("");
    const navigate = useNavigate(); //переменная для перехода между страницами

    //функция для входа пользователя в систему
    const handleLogin = async () => {
        if (!email.trim()) {
            alert("Введите email");
            return;
        }

        if(!password.trim()) {
            alert("Введите пароль");
            return;
        }
        try {
            const userIn = await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                alert("Неверный email или пароль");
                return;
            }
            alert("Ошибка входа");
        }
    };

    //показываем на экране
    return (
        <div className="container" >

            <div className="card">
                <h2>Вход</h2>

                <input placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)} />

                <input placeholder="Пароль"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                />

                <button 
                onClick={handleLogin}>
                    Войти
                </button>

                <p className="link"
                onClick={() => navigate("/register")} >
                    Нет аккаунта? Регистрация
                </p>
            </div>

        </div>
    )

}