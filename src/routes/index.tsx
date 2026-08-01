import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layout/app-layout';
import ProtectedRoute from '../components/protected-route';
import AdminRoute from '../components/admin-route';

import {
  CreateProductPage,
  DashboardPage,
  ErrorPage,
  LoginPage,
  ProductDetailsPage,
  ProductMovementPage,
  ProductPage,
  ReportPage,
  SellPage,
} from '../pages';

export const router = createBrowserRouter([
  // ── Public routes ─────────────────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
  },

  // ── Protected routes ──────────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          // Accessible by ALL authenticated users (Admins & Cashiers)
          {
            path: '/sell',
            element: <SellPage />,
          },

          // Restricted to ADMIN ONLY
          {
            element: <AdminRoute />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: '/products',
                element: <ProductPage />,
              },
              {
                path: '/movement',
                element: <ProductMovementPage />,
              },
              {
                path: '/products/:productId',
                element: <ProductDetailsPage />,
              },
              {
                path: '/products/create',
                element: <CreateProductPage />,
              },
              {
                path: '/products/edit/:productId',
                element: <CreateProductPage />,
              },
              {
                path: '/report',
                element: <ReportPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Fallback redirect ──────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to='/sell' replace />,
  },
]);
