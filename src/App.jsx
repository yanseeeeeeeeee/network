import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useEffect } from 'react';

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';

import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoute from './routes/AuthRoute';

import { auth } from './firebase';
import AdminPush from './pages/AdminPush'

export default function App() {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const ADMIN_EMAILS = [
    "anasemenova56966@gmail.com"
  ];

  useEffect(() => {

    //проверка пользователя в приложении для его дальнейшей работы
    const tutu = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
    });

    return () => tutu();

  }, []);

  if (loading) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <Routes>
      <Route path="/" element={
        <AuthRoute user ={user}>
          <Login/>
        </AuthRoute>
      }
        />
      <Route path="/register" element={
        <AuthRoute user={user}>
          <Register />
        </AuthRoute>
        }
        />
      <Route path="/home" element={
        <ProtectedRoute user={user}>
          <Home/>
        </ProtectedRoute>
        }
        />
        <Route
        path="/admin-push"
        element={
          <ProtectedRoute user={user}>
            {ADMIN_EMAILS.includes(user?.email) ? (
              <AdminPush/>
            ) : (
              <Navigate to="/home" replace/>
            )}
          </ProtectedRoute>
        }
        />
    </Routes>
  )
}
