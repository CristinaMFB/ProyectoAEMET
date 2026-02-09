import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import './index.css'
import App from './App.jsx'
import { Inicio } from "./pages/Inicio.jsx";
import { PrediccionDias } from "./pages/PrediccionDias.jsx" 
import { PrediccionHoras } from "./pages/PrediccionHoras.jsx"

const router = createBrowserRouter([ 
  { 
    path: "/", 
    element: <Inicio />, 
  }, 
  { 
    path: "/prediccion-dias", 
    element: <PrediccionDias />, 
  }, 
  { 
    path: "/prediccion-horas", 
    element: <PrediccionHoras />, 
  }, 
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
