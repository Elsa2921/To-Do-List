import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/style.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import App from './App';
import reportWebVitals from './reportWebVitals';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { loadConfig, getAppConfig} from './config';


const root = ReactDOM.createRoot(document.getElementById('root'));

loadConfig().then(() => {
  const config = getAppConfig();
  
  if (!config) {
    throw new Error('Config not loaded!');
  }

  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

