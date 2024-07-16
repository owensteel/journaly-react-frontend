// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import { RootState } from './store';
import Cookies from 'js-cookie';
import { login } from './store/userSlice';

const App: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        // Check for the auth cookie on app initialization
        const authToken = Cookies.get('auth_token');
        if (authToken) {
            dispatch(login());
        }
    }, [dispatch]);

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/welcome" />
                } />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/welcome" element={<Welcome />} />
            </Routes>
        </div>
    );
};

export default App;
