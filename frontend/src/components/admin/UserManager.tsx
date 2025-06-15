"use client";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_blocked: boolean;
  created_at: string;
}

const API_URL = "/admin/users";

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id: number, block: boolean) => {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_blocked: block }),
    });
    if (res.ok) {
      setNotification(block ? "User blocked." : "User unblocked.");
      fetchUsers();
    } else {
      setNotification("Failed to update user.");
    }
    setLoading(false);
  };

  const handlePromote = async (id: number, admin: boolean) => {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_admin: admin }),
    });
    if (res.ok) {
      setNotification(admin ? "User promoted to admin." : "User demoted.");
      fetchUsers();
    } else {
      setNotification("Failed to update user.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotification("User deleted.");
      fetchUsers();
    } else {
      setNotification("Failed to delete user.");
    }
    setLoading(false);
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      {notification && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {notification}
        </div>
      )}
      {loading && <div className="mb-2 text-yellow-600">Loading...</div>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-yellow-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Username</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Admin</th>
            <th className="p-2 text-left">Blocked</th>
            <th className="p-2 text-left">Created</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.is_admin ? "Yes" : "No"}</td>
              <td className="p-2">{user.is_blocked ? "Yes" : "No"}</td>
              <td className="p-2">{user.created_at}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handlePromote(user.id, !user.is_admin)}
                  disabled={loading}
                >
                  {user.is_admin ? "Demote" : "Promote"}
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => handleBlock(user.id, !user.is_blocked)}
                  disabled={loading}
                >
                  {user.is_blocked ? "Unblock" : "Block"}
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(user.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserManager;
