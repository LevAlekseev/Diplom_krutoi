import React from "react";
import "./LoginPageCSS.css";
import Input from '../../components/Input/Input';
import imgSrc from "../../assets/images/b1c78b52-6309-486f-a88f-8c3a1bd3944e.jpg";

const LoginPage = () => {
    return (
        <div className="auth-box">
            <div className="auth-left">
                <img src={imgSrc} alt="Изображение" />
            </div>
            <div className="auth-right">
                <h1>Авторизация</h1>
                <form>
                    <Input type="email" placeholder="Почта"/>
                    <Input type="password" placeholder="Пароль"/>
                    <div className="checkbox-container">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Запомнить меня</label>
                    </div>
                    <button type="submit" className="login-btn">Войти</button>
                    <a href="/register" className="register-link">Регистрация</a>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
