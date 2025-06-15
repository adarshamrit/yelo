import React from "react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    return (
      <div className="rounded-lg shadow bg-white p-6 mb-6 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600">Access Denied</h2>
        <p className="mb-4">You must be logged in to view this page.</p>
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
