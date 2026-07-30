import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactLenis } from 'lenis/react';
import { ToastProvider } from './components/ui/Toast';
import App from './App';
import 'lenis/dist/lenis.css';
import './index.css';

// Users who ask for reduced motion get native scrolling instead of interpolation.
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const lenisOptions = {
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !prefersReducedMotion,
  touchMultiplier: 1.5,
  // Native momentum already feels right on touch devices — don't interpolate it.
  syncTouch: false,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ReactLenis root options={lenisOptions}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ReactLenis>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
