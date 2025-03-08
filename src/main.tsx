// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate de que el archivo App.tsx existe en src

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);
