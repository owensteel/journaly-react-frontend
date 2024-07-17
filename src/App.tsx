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
import axiosAPI from './services/api';

let hasFetchedUser = false

const App: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        /*
            Request updated profile info about the user
            In other cases profile info would be extracted from the
            authToken, however since this is called on refresh it is
            worth the time to update the profile data from the OAuth
            source
        */
        const fetchUser = async () => {
            if (hasFetchedUser) {
                return
            }

            const oauthToken = Cookies.get('oauth_token');
            if (oauthToken) {
                try {
                    hasFetchedUser = true

                    const response = await axiosAPI.post('/auth/google', { token: oauthToken });
                    const { authToken, user } = response.data;

                    // Update the auth token
                    Cookies.set('auth_token', authToken, { expires: 7 });

                    dispatch(login({ name: user.name, picture: user.picture }));
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUser();
    }, [dispatch]);

    return !hasFetchedUser ? (
        <div>
            {/* TODO: loading sequence */}
        </div>
    ) : (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    isLoggedIn ? <Dashboard /> : <Welcome />
                } />
                <Route path="/dashboard" element={
                    isLoggedIn ? <Dashboard /> : <Navigate to="/" />
                } />
                <Route path="/welcome" element={<Welcome />} />
            </Routes>
        </div>
    );
};

export default App;
