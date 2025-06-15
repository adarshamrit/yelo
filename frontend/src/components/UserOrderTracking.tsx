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
  tracking_info?: any[];
}

const API_URL = "/admin/orders";

const UserOrderTracking = ({ orderId }: { orderId: number }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}`)
      .then((res) => res.json())
      .then((orders) => {
        const found = orders.find((o: Order) => o.id === orderId);
        setOrder(found || null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-4">Order Tracking</h2>
      <div className="mb-2">Order ID: {order.id}</div>
      <div className="mb-2">Status: <b>{order.status}</b></div>
      <div className="mb-2">Delivery: {order.delivery_person || <span className="text-gray-400">Unassigned</span>}</div>
      <div className="mb-2">Address: {order.address}</div>
      <div className="mb-2">Total: ${order.total}</div>
      <div className="mb-2">Tracking Info:</div>
      <ul className="list-disc ml-6">
        {(order.tracking_info || []).map((event, idx) => (
          <li key={idx} className="mb-1">
            <span className="font-semibold">{event.status}</span> at {event.timestamp}
            {event.location && <span> ({event.location})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrderTracking;
