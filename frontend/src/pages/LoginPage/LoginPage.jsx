import React, { useState } from "react";
import axios from "axios";
import "./LoginPageCSS.css";
import Input from "../../components/Input/Input";
import imgSrc from "../../assets/images/b1c78b52-6309-486f-a88f-8c3a1bd3944e.jpg";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "", remember: false });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email: formData.email,
                password: formData.password,
            });
            console.log("Успешный вход:", response.data);
            // можно сохранить токен и перейти на другую страницу
        } catch (err) {
            console.error(err);
            setError("Неверная почта или пароль");
        }
    };

    return (
        <div className="auth-box">
            <div className="auth-left">
                <img src={imgSrc} alt="Изображение" />
            </div>
            <div className="auth-right">
                <h1>Авторизация</h1>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Почта"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            checked={formData.remember}
                            onChange={handleChange}
                        />
                        <label htmlFor="remember">Запомнить меня</label>
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" className="login-btn">Войти</button>
                   
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
