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
import MarksPage from './pages/MarksPage/MarksPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import MainPage2 from './pages/MainPage2/MainPage2';
import TeacherProfilePage from './pages/TeacherProfilePage/TeacherProfilePage';
import LessonsPage2 from './pages/LessonsPage2/LessonsPage2';
import ClassRankingPage from './pages/Classes/Classes';
import ConstrPage from './pages/ConstrPage/ConstrPage';

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
    const { user } = useAuth();
    const role = user?.role || localStorage.getItem('role');
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/main"
                    element={
                        <ProtectedRoute>
                            {role === 'teacher' ? <MainPage2 /> : <MainPage />}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            {role === 'teacher' ? <TeacherProfilePage /> : <ProfilePage />}
                        </ProtectedRoute>
                    }
                />
                <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/constructor" element={<ProtectedRoute><ConstrPage /></ProtectedRoute>} />
                <Route
                    path="/lessons/:courseId"
                    element={
                        <ProtectedRoute>
                            {role === 'teacher' ? <LessonsPage2 /> : <LessonsPage />}
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
                <Route
                    path="/marks"
                    element={
                        <ProtectedRoute>
                            <MarksPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/classes/:classId"
                    element={
                        <ProtectedRoute>
                            <ClassRankingPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/main" />} />
            </Routes>
        </Router>
    );
}

export default App;