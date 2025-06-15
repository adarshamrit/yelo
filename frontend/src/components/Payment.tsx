// src/components/Payment.tsx
import React from "react";

const Payment = () => {
  return (
    <div className="rounded-lg shadow bg-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>Payment
      </h2>
      <p className="text-gray-600 mb-4">Payment integration coming soon.</p>
      <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition">Pay Now</button>
    </div>
  );
};

export default Payment;
