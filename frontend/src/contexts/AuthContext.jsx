import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('lastUsername');
        if (token) {
            authAPI.getProfile()
                .then(response => {
                    // Берём роль из профиля или из localStorage
                    const role = response.data.role || localStorage.getItem('role');
                    setUser({ ...response.data, role });
                })
                .catch(() => {
                    // Если профиль не загрузился, но токен есть, сохраняем хотя бы username
                    if (username) {
                        setUser({ username });
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        const { access, refresh, role } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('lastUsername', credentials.username);
        localStorage.setItem('role', role);
        // После логина сразу подгружаем полный профиль
        const profile = await authAPI.getProfile();
        const userData = { ...profile.data, role: profile.data.role || role };
        setUser(userData);
        return userData;
    };

    const register = async (data) => {
        const response = await authAPI.register(data);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 