import React from 'react';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { login } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api';
import { useAlert } from './AlertContext';

const Login: React.FC = () => {
    const { showAlert } = useAlert();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginFailure = () => {
        console.error('Login failed');
        showAlert('Something went wrong. Please try again.', 'error', 'Error');
    };

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                const response = await axiosInstance.post('/auth/google', { token: credentialResponse.credential });
                const { authToken, user } = response.data;

                // Set a cookie to keep the user logged in
                Cookies.set('auth_token', authToken, { expires: 7 });

                dispatch(login({ name: user.name, picture: user.picture }));
                navigate('/dashboard');
            } catch (error) {
                console.error(error)
                handleLoginFailure()
            }
        }
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
