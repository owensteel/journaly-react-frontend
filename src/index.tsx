import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './index.css';

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        </I18nextProvider>
    </React.StrictMode>
);
