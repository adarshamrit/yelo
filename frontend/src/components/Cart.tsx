// src/components/Cart.tsx
import React from "react";

const Cart = () => {
  // Placeholder cart
  const cart = [
    { id: 1, name: "Pizza", price: 10, qty: 1 },
    { id: 2, name: "Burger", price: 8, qty: 2 },
  ];
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="rounded-lg shadow bg-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>Cart
      </h2>
      <ul className="divide-y divide-gray-100">
        {cart.map((item) => (
          <li key={item.id} className="py-3 flex justify-between items-center">
            <span className="font-medium text-gray-900">{item.name} x {item.qty}</span>
            <span className="text-gray-700">${item.price * item.qty}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 font-bold text-lg text-right">Total: ${total}</div>
      <button className="mt-4 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition">Checkout</button>
    </div>
  );
};

export default Cart;
