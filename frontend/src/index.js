import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ViolationProvider } from './components/ViolationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ViolationProvider>
      <App />
    </ViolationProvider>
  </React.StrictMode>
);
