import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';

import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

import "./Login.css"

const CLIENT_ID = '104765080673-dk3okujubcs5k0qsb4duhh90n39t2fl6.apps.googleusercontent.com';

const Login: React.FC = () => {
    const dispatch = useDispatch();

    const handleSuccess = (response: CredentialResponse) => {
        console.log('Login Success:', response);
        // Handle successful login
        dispatch(login());
    };

    const handleError = () => {
        console.error('Login Error');
        // Handle error
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div className="login-wrapper">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
