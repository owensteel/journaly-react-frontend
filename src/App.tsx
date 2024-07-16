// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector hook from react-redux
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { RootState } from './store'; // Adjust based on your store structure

const App: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/welcome" />
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/welcome" element={<Welcome />} />
            </Routes>
        </div>
    );
};

export default App;
