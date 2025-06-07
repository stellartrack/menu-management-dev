import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthProvider, useAuth } from "./context/AuthContext";
import CustomPageLoader from "./components/styled/CustomPageLoader";

// 🔧 Utility function to recursively inject sidebar props into MainLayoutWrapper
const injectSidebarProps = (element, sidebarOpen, setSidebarOpen) => {
  if (!element) return element;

  // Direct match
  if (element.type?.name === "MainLayoutWrapper") {
    return React.cloneElement(element, { sidebarOpen, setSidebarOpen });
  }

  // If it's a wrapper (like ProtectedRoute), recurse into its children
  if (element.props?.children) {
    const modifiedChildren = React.Children.map(element.props.children, (child) =>
      injectSidebarProps(child, sidebarOpen, setSidebarOpen)
    );
    return React.cloneElement(element, {}, modifiedChildren);
  }

  return element;
};

// 🧩 Route renderer with sidebar props injected where needed
const renderRoutes = (routes, sidebarOpen, setSidebarOpen) =>
  routes.map(({ path, element, children }) => {
    const elWithProps = injectSidebarProps(element, sidebarOpen, setSidebarOpen);

    return (
      <Route key={path} path={path} element={elWithProps}>
        {children && renderRoutes(children, sidebarOpen, setSidebarOpen)}
      </Route>
    );
  });

const AppRouter = () => {
  const { authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) setSidebarOpen(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  if (authLoading) {
    return <CustomPageLoader message="Checking your credentials, please wait..." />;
  }

  return <Routes>{renderRoutes(routes, sidebarOpen, setSidebarOpen)}</Routes>;
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <AppRouter />
      </DndProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
