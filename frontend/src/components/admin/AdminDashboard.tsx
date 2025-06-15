"use client";
import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import ItemManager from "./ItemManager";
import OrderManager from "./OrderManager";
import UserManager from "./UserManager";
import Analytics from "./Analytics";
import Settings from "./Settings";

const AdminDashboard = () => {
  const [section, setSection] = useState("items");
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar section={section} setSection={setSection} />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          {section === "items" && <ItemManager />}
          {section === "orders" && <OrderManager />}
          {section === "users" && <UserManager />}
          {section === "analytics" && <Analytics />}
          {section === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
