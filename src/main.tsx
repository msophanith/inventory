import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import "goey-toast/styles.css";
import { GooeyToaster } from "goey-toast";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./features/auth/context/auth-context";
import { CurrencyProvider } from "./features/currency/context/currency-context";
import { LanguageProvider } from "./i18n/language-context";
import { DevToolsGuard } from "./components/security/devtools-guard";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <DevToolsGuard>
                <GooeyToaster position="top-right" />
                <RouterProvider router={router} />
              </DevToolsGuard>
            </LanguageProvider>
          </CurrencyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);