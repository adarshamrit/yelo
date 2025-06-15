"use client";
import React, { useEffect, useState } from "react";

interface Order {
  id: number;
  user_id: number;
  items: any[];
  total: number;
  status: string;
  address: string;
  created_at: string;
  updated_at: string;
  delivery_person?: string;
  tracking_info?: any;
}

const API_URL = "/admin/orders";
const statuses = ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"];

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editDelivery, setEditDelivery] = useState("");
  const [editTracking, setEditTracking] = useState<string>("");

  const fetchOrders = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order: Order) => {
    setEditId(order.id);
    setEditStatus(order.status);
    setEditDelivery(order.delivery_person || "");
    setEditTracking(JSON.stringify(order.tracking_info || [], null, 2));
  };

  const handleSave = async (id: number) => {
    setLoading(true);
    let tracking_info = [];
    try {
      tracking_info = JSON.parse(editTracking || "[]");
    } catch {
      setNotification("Invalid tracking info JSON");
      setLoading(false);
      return;
    }
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: editStatus, delivery_person: editDelivery, tracking_info }),
    });
    if (res.ok) {
      setNotification("Order updated!");
      setEditId(null);
      fetchOrders();
    } else {
      setNotification("Failed to update order.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotification("Order deleted.");
      fetchOrders();
    } else {
      setNotification("Failed to delete order.");
    }
    setLoading(false);
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
      {notification && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{notification}</div>
      )}
      {loading && <div className="mb-2 text-yellow-600">Loading...</div>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-yellow-100">
            <th className="p-2 text-left">Order ID</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Items</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Delivery</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-left">Tracking</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.user_id}</td>
              <td className="p-2">
                <ul className="list-disc ml-4">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.name} x {item.qty}</li>
                  ))}
                </ul>
              </td>
              <td className="p-2">${order.total}</td>
              <td className="p-2">
                {editId === order.id ? (
                  <select
                    className="border p-1 rounded"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  order.status
                )}
              </td>
              <td className="p-2">
                {editId === order.id ? (
                  <input
                    className="border p-1 rounded"
                    value={editDelivery}
                    onChange={(e) => setEditDelivery(e.target.value)}
                    placeholder="Delivery person"
                  />
                ) : (
                  order.delivery_person || <span className="text-gray-400">Unassigned</span>
                )}
              </td>
              <td className="p-2">{order.address}</td>
              <td className="p-2">
                {editId === order.id ? (
                  <textarea
                    className="border p-1 rounded w-48 h-24"
                    value={editTracking}
                    onChange={(e) => setEditTracking(e.target.value)}
                    placeholder="Tracking info (JSON)"
                  />
                ) : (
                  <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-x-auto">{JSON.stringify(order.tracking_info, null, 2)}</pre>
                )}
              </td>
              <td className="p-2 flex gap-2">
                {editId === order.id ? (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleSave(order.id)} disabled={loading}>
                      Save
                    </button>
                    <button className="bg-gray-300 text-gray-700 px-2 py-1 rounded" onClick={() => setEditId(null)} disabled={loading}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(order)} disabled={loading}>
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(order.id)} disabled={loading}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default OrderManager;
