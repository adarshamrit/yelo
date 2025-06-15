"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const API_BASE = "http://localhost:8000";

type Address = {
  id: number;
  label?: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_default: boolean;
};

const UserAddresses: React.FC = () => {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Address>>({});
  const [message, setMessage] = useState("");

  const fetchAddresses = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setAddresses(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchAddresses();
    // eslint-disable-next-line
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch(`${API_BASE}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage("Address added!");
      setForm({});
      fetchAddresses();
    } else {
      setMessage("Failed to add address.");
    }
    setLoading(false);
  };

  const setDefault = async (id: number) => {
    setLoading(true);
    await fetch(`${API_BASE}/addresses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_default: true }),
    });
    fetchAddresses();
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    await fetch(`${API_BASE}/addresses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAddresses();
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h3 className="text-xl font-bold mb-4 text-yellow-600">My Addresses</h3>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input className="w-full p-2 border rounded" name="label" value={form.label || ""} onChange={handleChange} placeholder="Label (Home, Work, etc)" />
        <input className="w-full p-2 border rounded" name="address" value={form.address || ""} onChange={handleChange} placeholder="Address" required />
        <input className="w-full p-2 border rounded" name="city" value={form.city || ""} onChange={handleChange} placeholder="City" />
        <input className="w-full p-2 border rounded" name="state" value={form.state || ""} onChange={handleChange} placeholder="State" />
        <input className="w-full p-2 border rounded" name="zip_code" value={form.zip_code || ""} onChange={handleChange} placeholder="Zip Code" />
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" name="is_default" checked={!!form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} />
            Set as default
          </label>
          <button type="submit" className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded font-semibold" disabled={loading}>
            {loading ? "Saving..." : "Add Address"}
          </button>
        </div>
      </form>
      <ul className="space-y-3">
        {addresses.map(addr => (
          <li key={addr.id} className={`p-3 border rounded flex flex-col md:flex-row md:items-center md:justify-between ${addr.is_default ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}>
            <div>
              <div className="font-semibold">{addr.label || "Address"} {addr.is_default && <span className="text-xs text-yellow-600 ml-2">(Default)</span>}</div>
              <div className="text-sm text-gray-700">{addr.address}, {addr.city}, {addr.state} {addr.zip_code}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              {!addr.is_default && <button className="text-xs px-2 py-1 bg-yellow-400 text-white rounded" onClick={() => setDefault(addr.id)}>Set Default</button>}
              <button className="text-xs px-2 py-1 bg-red-400 text-white rounded" onClick={() => handleDelete(addr.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserAddresses;
