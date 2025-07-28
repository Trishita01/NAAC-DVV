
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './auth/authProvider.jsx';
import { AppContextProvider } from './contextprovider/appContext.jsx';

import './index.css'
import App from './App'
import './App.css'


import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
 
  <BrowserRouter>
    <AuthProvider>
      <AppContextProvider>
      <App />
      </AppContextProvider>
    </AuthProvider>
  </BrowserRouter>

)
