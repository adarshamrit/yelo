"use client";
import React, { useEffect, useState } from "react";

const API_URL = "/admin/analytics";

const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!data) return <div>No analytics data.</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.orders}</div>
          <div className="text-gray-600">Orders</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.users}</div>
          <div className="text-gray-600">Users</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.items}</div>
          <div className="text-gray-600">Items</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">${data.revenue}</div>
          <div className="text-gray-600">Revenue</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold">{data.active_users}</div>
          <div className="text-gray-600">Active Users</div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
