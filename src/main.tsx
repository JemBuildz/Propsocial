import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import './index.css';

// Intercept and swallow noise from third-party browser extensions (e.g. Chrome/Firefox extensions)
if (typeof window !== 'undefined') {
  const isExtensionError = (err: any) => {
    if (!err) return false;
    const msg = typeof err === 'string' ? err : (err.message || err.reason?.message || '');
    const stack = err.stack || err.reason?.stack || '';
    const filename = err.filename || '';
    return (
      filename.includes('chrome-extension://') ||
      filename.includes('moz-extension://') ||
      stack.includes('chrome-extension://') ||
      stack.includes('moz-extension://') ||
      msg.includes('Could not establish connection') ||
      msg.includes('Receiving end does not exist') ||
      msg.includes("reading 'allowed'")
    );
  };

  window.addEventListener('error', (event) => {
    if (isExtensionError(event.error || event)) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionError(event.reason)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
