import React,{ useEffect, useState } from "react";

const CustomPageLoader = React.lazy(() => import('../components/styled/CustomPageLoader'));

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setRedirecting(true);
      const currentUrl = window.location.href;
      const reactRedirectUrl = `${window.location.origin}/auth/redirect?redirect_url=${btoa(currentUrl)}`;
      const loginBaseUrl = import.meta.env.VITE_APP_API_AUTH_BASE_URL;
      const laravelLoginUrl = `${loginBaseUrl}login?redirect_url=${btoa(reactRedirectUrl)}&redirect_type=${btoa("mern")}`;
      
      const timeout = setTimeout(() => {
        window.location.href = laravelLoginUrl;
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [authLoading, user]);

  if (authLoading || redirecting) {
    return <CustomPageLoader message="Checking your credentials, please wait..." />;
  }

  return children;
};

export default ProtectedRoute;
