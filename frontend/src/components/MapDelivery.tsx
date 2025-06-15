// src/components/MapDelivery.tsx
import React from "react";

const MapDelivery = () => {
  return (
    <div className="rounded-lg shadow bg-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>Order Delivery Map
      </h2>
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded">
        <span className="text-gray-400">Map integration coming soon.</span>
      </div>
    </div>
  );
};

export default MapDelivery;
