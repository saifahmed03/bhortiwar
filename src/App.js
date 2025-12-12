// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";

import routes from "./routes";

const App = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {routes.map(({ path, element }, index) => (
                <Route key={index} path={path} element={element} />
              ))}
            </Routes>
          </Router>
        </AdminProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;

