// src/components/Items.tsx
import React from "react";

const Items = () => {
  // Placeholder items
  const items = [
    { id: 1, name: "Pizza", price: 10 },
    { id: 2, name: "Burger", price: 8 },
    { id: 3, name: "Sushi", price: 15 },
  ];

  return (
    <div className="rounded-lg shadow bg-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>Items
      </h2>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id} className="py-3 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="text-gray-500 text-sm">${item.price}</span>
            </div>
            <button className="ml-2 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded transition">Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
