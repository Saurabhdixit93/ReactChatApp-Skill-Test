import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'font-awesome/css/font-awesome.min.css';
import { AuthContextProvider } from './Context/AuthContext';
import { ChatAuthContextProvider } from './Context/ChatContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
     <ChatAuthContextProvider>
        <App />
     </ChatAuthContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
