import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Soft UI Context Provider
import { SoftUIControllerProvider } from "context";

// Auth & Break Context Providers
import { AuthProvider } from "./AuthContext";
import { BreakProvider } from "context/BreakContext"; // ✅ BreakProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <SoftUIControllerProvider>
      <AuthProvider>
        <BreakProvider> {/* ✅ Wrap App inside BreakProvider */}
          <App />
        </BreakProvider>
      </AuthProvider>
    </SoftUIControllerProvider>
  </BrowserRouter>
);
