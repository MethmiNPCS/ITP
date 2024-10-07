import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

// Create a root container
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app using the new API
root.render(
  <BrowserRouter>
    <SnackbarProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </SnackbarProvider>
  </BrowserRouter>
);

