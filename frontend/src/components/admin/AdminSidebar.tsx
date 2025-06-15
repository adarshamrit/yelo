"use client";
import React from "react";

const AdminSidebar = ({ section, setSection }: { section: string; setSection: (s: string) => void }) => (
  <aside className="w-64 bg-white shadow h-screen p-6 flex flex-col gap-4">
    <h2 className="text-2xl font-bold mb-6 text-yellow-600">Admin</h2>
    <nav className="flex flex-col gap-2">
      <button className={`text-left px-2 py-2 rounded ${section === "items" ? "bg-yellow-100 font-bold" : "hover:bg-yellow-50"}`} onClick={() => setSection("items")}>Items</button>
      <button className={`text-left px-2 py-2 rounded ${section === "orders" ? "bg-yellow-100 font-bold" : "hover:bg-yellow-50"}`} onClick={() => setSection("orders")}>Orders</button>
      <button className={`text-left px-2 py-2 rounded ${section === "users" ? "bg-yellow-100 font-bold" : "hover:bg-yellow-50"}`} onClick={() => setSection("users")}>Users</button>
      <button className={`text-left px-2 py-2 rounded ${section === "analytics" ? "bg-yellow-100 font-bold" : "hover:bg-yellow-50"}`} onClick={() => setSection("analytics")}>Analytics</button>
      <button className={`text-left px-2 py-2 rounded ${section === "settings" ? "bg-yellow-100 font-bold" : "hover:bg-yellow-50"}`} onClick={() => setSection("settings")}>Settings</button>
    </nav>
  </aside>
);

export default AdminSidebar;
