// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// GLOBAL STYLES
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

// MATERIAL UI
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// ROOT CONTAINER
const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer);

// RENDER APP
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
