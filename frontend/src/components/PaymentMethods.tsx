import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const API_BASE = "http://localhost:8000";

export interface PaymentMethod {
  id: number;
  card_type: string;
  card_last4: string;
  is_default: boolean;
}

const cardLogos: Record<string, string> = {
  Visa: "/visa.svg",
  MasterCard: "/mastercard.svg",
  Amex: "/amex.svg",
  Discover: "/discover.svg",
};

const PaymentMethods: React.FC = () => {
  const { token } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ card_type: "Visa", card_number: "", is_default: false });
  const [adding, setAdding] = useState(false);

  const fetchMethods = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/payment_methods/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      setMethods(await res.json());
    } catch {
      setError("Could not load payment methods.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchMethods(); }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const last4 = form.card_number.slice(-4);
      const res = await fetch(`${API_BASE}/payment_methods/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_type: form.card_type,
          card_last4: last4,
          card_token: `tok_${Math.random().toString(36).slice(2,10)}`,
          is_default: form.is_default,
        }),
      });
      if (!res.ok) throw new Error("Failed to add");
      setForm({ card_type: "Visa", card_number: "", is_default: false });
      setAdding(false);
      fetchMethods();
    } catch {
      setError("Could not add payment method.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this payment method?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/payment_methods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchMethods();
    } catch {
      setError("Could not delete payment method.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/payment_methods/${id}/set_default`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to set default");
      fetchMethods();
    } catch {
      setError("Could not set default.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div>Loading...</div>}
      <div className="flex flex-wrap gap-4 mb-4">
        {methods.map((pm) => (
          <div
            key={pm.id}
            className={`relative w-72 h-44 rounded-xl shadow-lg flex flex-col justify-between p-5 transition-colors duration-300 ${pm.is_default ? "bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-700" : "bg-gray-100 border border-gray-300"}`}
            style={{ aspectRatio: '1.586/1' }}
          >
            <span className="text-lg font-mono font-semibold text-gray-800 tracking-widest">XXXX {pm.card_last4}</span>
            <div className="flex items-end justify-between w-full">
              <span className={`text-xs font-semibold ${pm.is_default ? "text-yellow-900" : "text-gray-500"}`}>
                {pm.is_default ? "Default" : ""}
              </span>
              <img
                src={cardLogos[pm.card_type] || "/card.svg"}
                alt={pm.card_type}
                className="w-12 h-12 object-contain absolute bottom-4 right-4"
                style={{ pointerEvents: 'none' }}
              />
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleSetDefault(pm.id)}
                disabled={pm.is_default || loading}
              >
                Set Default
              </button>
              <button
                className="px-2 py-1 text-xs bg-red-200 rounded hover:bg-red-400"
                onClick={() => handleDelete(pm.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {adding ? (
        <form onSubmit={handleAdd} className="space-y-2 mb-2">
          <select
            className="w-full p-2 border rounded"
            value={form.card_type}
            onChange={e => setForm(f => ({ ...f, card_type: e.target.value }))}
            title="Card Type"
          >
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="Amex">Amex</option>
            <option value="Discover">Discover</option>
          </select>
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Card Number (only last 4 will be saved)"
            value={form.card_number}
            onChange={e => setForm(f => ({ ...f, card_number: e.target.value }))}
            maxLength={16}
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
            />
            Set as default
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded font-semibold"
              disabled={loading}
            >
              Add
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setAdding(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded font-semibold"
          onClick={() => setAdding(true)}
        >
          Add Payment Method
        </button>
      )}
    </div>
  );
};

export default PaymentMethods;
