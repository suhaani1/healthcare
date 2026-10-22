import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
// import Welcome from './components/welcome/welcome.jsx'
// import Register from './components/register/register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <App />
     {/* <Welcome/> */}
     {/* <Register/> */}
    </BrowserRouter>
  </StrictMode>,
)
