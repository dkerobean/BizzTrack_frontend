import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from 'sonner';
import "./styles/index.scss";
import { AuthRoot } from "../api/authContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <AuthRoot>
      <App />
    </AuthRoot>
  </StrictMode>,
)