// src/components/Cart.tsx
import React, { useEffect, useState } from "react";
import { useCart } from "@frontend/context/CartContext";
import { useAuth } from "../hooks/useAuth";

const API_BASE = "http://localhost:8000";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [showPayment, setShowPayment] = useState(false);
  const [card, setCard] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : [])
      .then((data) => {
        setAddresses(data);
        const def = data.find((a: any) => a.is_default);
        setSelectedAddressId(def ? def.id : data[0]?.id || null);
      });
  }, [token]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedAddressId) {
      setError("Please select a delivery address.");
      return;
    }
    if (!card.match(/^[0-9]{12,19}$/)) {
      setError("Please enter a valid card number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/payment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
          total,
          address_id: selectedAddressId,
          card,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.detail || "Payment failed");
      else {
        setSuccess("Payment successful! Order placed.");
        clearCart();
        setShowPayment(false);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="rounded-lg shadow bg-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>Cart
        </h2>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow bg-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>Cart
      </h2>
      <ul className="divide-y divide-gray-100">
        {cart.map((item) => (
          <li key={item.id} className="py-3 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{item.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-red-400 text-white rounded"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <span className="text-gray-700">${item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 font-bold text-lg text-right">Total: ${total}</div>
      <button
        className="mt-4 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition"
        onClick={() => setShowPayment(true)}
      >
        Checkout
      </button>
      {showPayment && (
        <form className="mt-6 p-4 border rounded bg-gray-50" onSubmit={handleCheckout}>
          <h3 className="text-lg font-bold mb-2 text-yellow-600">Payment Details</h3>
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Delivery Address</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedAddressId || ""}
              onChange={e => setSelectedAddressId(Number(e.target.value))}
              required
            >
              <option value="" disabled>Select address</option>
              {addresses.map((addr: any) => (
                <option key={addr.id} value={addr.id}>
                  {addr.label ? `${addr.label}: ` : ""}{addr.address}, {addr.city}, {addr.state} {addr.zip_code}
                  {addr.is_default ? " (Default)" : ""}
                </option>
              ))}
            </select>
          </div>
          <input
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            type="text"
            placeholder="Card Number"
            value={card}
            onChange={e => setCard(e.target.value)}
          />
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
          {success && <div className="text-green-600 mb-2 text-sm">{success}</div>}
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              onClick={() => setShowPayment(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay & Place Order"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Cart;
