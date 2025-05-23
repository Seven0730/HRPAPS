import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DashboardProvider } from './context/DashboardContext';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </React.StrictMode>
);
