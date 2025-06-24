import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';
import { useAuth } from '../context/AuthContext';
const CustomPageLoader = React.lazy(() => import('../components/styled/CustomPageLoader'));

const MainLayoutWrapper = (props) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <CustomPageLoader message="Verifying authentication..." />;
  }

  if (!user) {
    // Optionally redirect or show a loader until ProtectedRoute handles it
    return <CustomPageLoader message="Verifying authentication..." />;
  }

  return (
    <Suspense fallback={<CustomPageLoader message="Loading layout..." />}>
      <MainLayout {...props}>
        <Outlet />
      </MainLayout>
    </Suspense>
  );
};

export default MainLayoutWrapper;
