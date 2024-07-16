import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice'; // Adjust path based on your actual file structure

import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

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
            <div>
                <h2>Login with Google</h2>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
