import { createRoot, hydrateRoot } from 'react-dom/client'
import './assets/index.css'
import App from './App';

const container = document.getElementById('root')!;

// Use hydration for SSG, regular render for CSR
if (container.innerHTML) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
