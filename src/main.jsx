import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from 'sonner';
// import "bootstrap/dist/css/bootstrap.min.css";
// import * as bootstrap from 'bootstrap'
// import './assets/scss/theme.scss'
import "./styles/index.scss";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Toaster richColors position="top-right" />
    <App />
  </StrictMode>,
)
