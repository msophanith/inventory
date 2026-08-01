import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./features/auth/context/auth-context";
import { CurrencyProvider } from "./features/currency/context/currency-context";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <RouterProvider router={router} />
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);