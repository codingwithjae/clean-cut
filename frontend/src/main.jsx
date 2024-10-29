import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '/global.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

// Implementar validaciones de formulario para inicio de sesión y registro con React Toastify // PENDIENTE
// Implementar validaciones de URL para el input que recibe links React Toastify // PENDIENTE
// Mejorar la implementación de las rutas según buenas prácticas para react router. Tanto rutas pública como privadas // PENDIENTE
// Revisar que los props funcionen correctamente // PENDIENTE


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
