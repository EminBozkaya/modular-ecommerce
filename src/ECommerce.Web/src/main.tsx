import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/index'  // i18next — App'ten önce import edilmeli
import { AppProviders } from './app/providers'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
