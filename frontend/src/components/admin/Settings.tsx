"use client";
import React, { useEffect, useState } from "react";

const API_URL = "/admin/settings";

const Settings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((d) => setSettings(d))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) setNotification("Settings updated!");
    else setNotification("Failed to update settings.");
    setLoading(false);
  };

  if (loading || !settings) return <div>Loading settings...</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      {notification && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{notification}</div>
      )}
      <form className="space-y-4 max-w-md" onSubmit={handleSave}>
        <div>
          <label className="block mb-1 font-semibold">Payment Gateway</label>
          <select
            name="payment_gateway"
            className="border p-2 rounded w-full"
            value={settings.payment_gateway}
            onChange={handleChange}
          >
            <option value="Stripe">Stripe</option>
            <option value="PayPal">PayPal</option>
            <option value="Razorpay">Razorpay</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Delivery Radius (km)</label>
          <input
            name="delivery_radius_km"
            type="number"
            className="border p-2 rounded w-full"
            value={settings.delivery_radius_km}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            name="service_open"
            type="checkbox"
            checked={settings.service_open}
            onChange={handleToggle}
          />
          <label className="font-semibold">Service Open</label>
        </div>
        <button className="bg-yellow-400 px-4 py-2 rounded text-white font-semibold" type="submit" disabled={loading}>
          Save
        </button>
      </form>
    </section>
  );
};

export default Settings;
