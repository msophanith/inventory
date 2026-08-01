import { createBrowserRouter, Navigate } from 'react-router-dom';

import AppLayout from '../layout/app-layout';
import ProtectedRoute from '../components/protected-route';

import {
  ErrorPage,
  LoginPage,
  ProductPage,
  ProductMovementPage,
  ProductDetailsPage,
  CreateProductPage,
  ReportPage,
  SellPage,
  DashboardPage,
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
          {
            path: '/sell',
            element: <SellPage />,
          },
          // {
          //   path: '/emi',
          //   element: <EMIPage />,
          // },
          // {
          //   path: '/expense-split',
          //   element: <ExpenseSplitPage />,
          // },
          // {
          //   path: '/discount',
          //   element: <DiscountPage />,
          // },
        ],
      },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
]);
