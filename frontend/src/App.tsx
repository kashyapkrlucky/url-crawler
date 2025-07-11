import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthProvider";

const Home = lazy(() => import("./pages/Home"));
const DetailsPage = lazy(() => import("./pages/Details"));
const AuthForm = lazy(() => import("./pages/AuthPage"));
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/details/:urlId"
          element={
            isAuthenticated ? <DetailsPage /> : <Navigate to="/sign-in" />
          }
        />
        <Route
          path="/sign-in"
          element={
            !isAuthenticated ? <AuthForm mode="signin" /> : <Navigate to="/" />
          }
        />
        <Route
          path="/sign-up"
          element={
            !isAuthenticated ? <AuthForm mode="signup" /> : <Navigate to="/" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
