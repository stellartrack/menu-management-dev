import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayoutWrapper from '../layouts/MainLayoutWrapper';
import ProtectedRoute from '../auth/ProtectedRoute';
const CustomPageLoader = React.lazy(() => import('../components/styled/CustomPageLoader'));

const Dashboard = lazy(() => import('../pages/Dashboard'));
const MenuManagement = lazy(() => import('../pages/MenuManagement'));
const RedirectAuth = lazy(() => import('../auth/RedirectAuth'));

const routes = [
  {
    path: '/auth/redirect',
    element: (
      <Suspense fallback={<CustomPageLoader />}>
        <RedirectAuth />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayoutWrapper />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'menu-management', element: <MenuManagement /> },
    ],
  },
  {
    path: '*',
    element: <div>404 Page Not Found</div>,
  },
];

export default routes;
