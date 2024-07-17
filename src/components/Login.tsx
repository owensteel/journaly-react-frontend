import React from 'react';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { login } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import axiosAPI from '../services/api';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                const response = await axiosAPI.post('/auth/google', { token: credentialResponse.credential });
                const { authToken } = response.data;

                // Set a cookie to keep the user logged in
                Cookies.set('auth_token', authToken, { expires: 7 }); // Expires in 7 days
                dispatch(login());
                navigate('/dashboard');
            } catch (error) {
                console.error('Login failed:', error);
            }
        }
    };

    const handleLoginFailure = () => {
        console.error('Login failed');
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
            <div>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
