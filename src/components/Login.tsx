import React from 'react';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { login } from '../store/userSlice'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

import "./Login.css"

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginSuccess = (response: CredentialResponse) => {
        // Insert backend OAuth logic...
        if (response.credential) {
            // Set a cookie to keep the user logged in
            Cookies.set('auth_token', response.credential, { expires: 7 }); // Expires in 7 days
            dispatch(login());
            navigate('/dashboard');
        }
    };

    const handleLoginFailure = () => {
        console.error('Login failed');
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
            <div>
                <h2>Login</h2>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
