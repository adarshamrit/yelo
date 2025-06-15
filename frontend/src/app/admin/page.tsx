"use client";
import AdminDashboard from "@frontend/components/admin/AdminDashboard";
import ProtectedRoute from "@frontend/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
