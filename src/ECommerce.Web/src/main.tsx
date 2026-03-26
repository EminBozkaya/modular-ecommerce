import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/index'  // i18next — App'ten önce import edilmeli
import { AppProviders } from './app/providers'
import './index.css'
import 'flag-icons/css/flag-icons.min.css'

console.log('🌐 [FRONTEND-DEBUG] API URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🧪 [FRONTEND-DEBUG] USE MOCK API:', import.meta.env.VITE_USE_MOCK_API);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
