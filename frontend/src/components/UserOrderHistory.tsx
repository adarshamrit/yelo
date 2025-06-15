"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const API_BASE = "http://localhost:8000";

const UserOrderHistory: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [tracking, setTracking] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  }, [token]);

  const fetchTracking = async (orderId: number) => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/orders/${orderId}/tracking`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setTracking(data.tracking_info || []);
      setSelectedOrder(orderId);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h3 className="text-xl font-bold mb-4 text-yellow-600">My Orders</h3>
      {loading && <div>Loading...</div>}
      <ul className="space-y-4">
        {orders.map(order => (
          <li key={order.id} className="border rounded p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">Order #{order.id}</div>
                <div className="text-sm text-gray-700">{order.address}</div>
                <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</div>
                <div className="text-sm mt-1">Total: <span className="font-bold">${order.total}</span></div>
                <div className="text-sm">Status: <span className="font-semibold text-yellow-700">{order.status}</span></div>
              </div>
              <button className="mt-2 md:mt-0 px-3 py-1 bg-blue-500 text-white rounded text-xs" onClick={() => fetchTracking(order.id)}>
                Track Order
              </button>
            </div>
            {selectedOrder === order.id && (
              <div className="mt-3 bg-gray-50 p-3 rounded">
                <div className="font-semibold mb-2">Tracking Info:</div>
                {tracking.length === 0 ? <div className="text-xs text-gray-500">No tracking updates yet.</div> : (
                  <ul className="text-xs space-y-1">
                    {tracking.map((t, i) => (
                      <li key={i}>{t.status} - {new Date(t.timestamp).toLocaleString()}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrderHistory;
