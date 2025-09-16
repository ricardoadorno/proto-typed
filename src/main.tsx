import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
