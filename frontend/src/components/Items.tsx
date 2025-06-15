// src/components/Items.tsx
import React, { useEffect, useState } from "react";
import { useCart } from "@frontend/context/CartContext";
import CategoryBubble from "./CategoryBubble";

const API_BASE = "http://localhost:8000"; // Adjust if backend runs elsewhere

const Items = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/items/`);
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data.items || data); // Support both {items: [...]} and [...] formats
      } catch (err) {
        setError("Could not load items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filtered items
  const filteredItems = items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading items...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative rounded-lg shadow bg-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>Store
      </h2>
      <input
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        type="text"
        placeholder="Search for items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredItems.map((item, idx) => {
          const imageUrl = item.image_url || `https://source.unsplash.com/400x300/?product,store,food,random&sig=${item.id || idx}`;
          return (
            <div key={item.id} className="bg-yellow-50 rounded-lg shadow p-4 flex flex-col justify-between h-full">
              <div>
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded mb-2 border border-yellow-100"
                  loading="lazy"
                />
                <div className="font-medium text-gray-900 text-lg mb-1">{item.name}</div>
                <div className="text-gray-500 text-sm mb-2">${item.price}</div>
                {item.category && <div className="text-xs text-yellow-700 mb-2">{item.category}</div>}
                {item.description && (
                  <div className="text-xs text-gray-600 mb-2">{item.description}</div>
                )}
                {item.contents && Array.isArray(item.contents) && item.contents.length > 0 && (
                  <ul className="text-xs text-gray-500 mb-2 list-disc list-inside">
                    {item.contents.map((content: string, i: number) => (
                      <li key={i}>{content}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                className="mt-2 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded transition"
                onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
      <CategoryBubble onSelect={setCategory} selected={category} />
    </div>
  );
};

export default Items;
