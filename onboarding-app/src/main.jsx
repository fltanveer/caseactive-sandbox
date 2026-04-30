import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PortalDashboard from './PortalDashboard.jsx'

const isPortal = window.location.hash === '#/portal';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPortal ? <PortalDashboard /> : <App />}
  </StrictMode>,
)
