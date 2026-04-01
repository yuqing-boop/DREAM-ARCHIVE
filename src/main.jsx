import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/pixelify-sans'
import './index.css'
import App from './App.jsx'
import CursorBlink from './components/CursorBlink.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CursorBlink />
    <App />
  </StrictMode>,
)
