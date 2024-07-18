// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { RootState } from './store';
import Cookies from 'js-cookie';
import { login } from './store/userSlice';
import axiosAPI from './services/api';

import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import theme from './theme/theme'

const App: React.FC = () => {
    const [userFetched, setUserFetched] = useState(false);
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            if (userFetched) {
                return
            }

            const authToken = Cookies.get('auth_token');
            if (authToken) {
                try {
                    const response = await axiosAPI.get('/auth/user', {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });

                    const { name, picture } = response.data;
                    dispatch(login({ name, picture }));

                    setUserFetched(true);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUserFetched(true);
            }
        };

        fetchUser();
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            {!userFetched ? (
                <div>
                    <Loading />
                </div>
            ) : (
                <Routes>
                    <Route path="/" element={
                        isLoggedIn ? <Dashboard /> : <Welcome />
                    } />
                    <Route path="/dashboard" element={
                        isLoggedIn ? <Dashboard /> : <Navigate to="/" />
                    } />
                    <Route path="/welcome" element={<Welcome />} />
                </Routes>
            )}
        </ThemeProvider>
    );
};

export default App;
