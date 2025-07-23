
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contextprovider/authcontext.jsx';


import './index.css'
import App from './App'
import './App.css'


import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
 
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>

)
