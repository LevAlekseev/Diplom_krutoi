import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import LessonsPage from './pages/LessonsPage/LessonsPage';
import LevelsPage from './pages/LevelPage/LevelPage';
import ExamplesPage from './pages/ExamplesPage/ExamplesPage';
import ExamplesInput from './pages/ExamplesPage/ExamplesInput';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ShopPage from './pages/ShopPage/ShopPage';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/main"
                    element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
                <Route path="/settings" element={<div>Настройки (заглушка)</div>} />
                <Route
                    path="/lessons"
                    element={
                        <ProtectedRoute>
                            <LessonsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/levels"
                    element={
                        <ProtectedRoute>
                            <LevelsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/examples"
                    element={
                        <ProtectedRoute>
                            <ExamplesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/examples-input"
                    element={
                        <ProtectedRoute>
                            <ExamplesInput />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/main" />} />
            </Routes>
        </Router>
    );
}

export default App;