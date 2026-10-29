import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/noto-sans-sc';
import './styles/index.css';
import { Toaster } from './components/ui/sonner';
import { Kit } from './pages/Kit';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Kit />
    <Toaster />
  </StrictMode>,
);
