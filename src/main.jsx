//CSS
import './index.css';
//Global
import React from 'react'
import { createRoot } from 'react-dom/client';
import { ContextProvider } from './contexts/ContextProvider.jsx'
import { RouterProvider } from 'react-router-dom';
import Router from './router.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={Router} />
    </ContextProvider>
  </React.StrictMode>,
)
