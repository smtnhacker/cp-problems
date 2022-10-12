import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { GoogleOAuthProvider } from '@react-oauth/google'

import { GOOGLE_OAUTH_CLIENT_ID } from './config';

import reportWebVitals from './reportWebVitals';
import './index.css';

import RouteWrapper from './RouteWrapper';

const container = document.getElementById('root')!;
const root = createRoot(container);

// axios.defaults.withCredentials = true;

root.render(
  // <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <Provider store={store}>
        <RouteWrapper />
      </Provider>
    </GoogleOAuthProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
