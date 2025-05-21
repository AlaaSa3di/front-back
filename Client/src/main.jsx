import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from "react-cookie";
import { Provider } from 'react-redux';
import store from './Redux';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <AuthProvider>  
          <App />
        </AuthProvider>
      </Provider>
    </CookiesProvider>
  </StrictMode>
);
