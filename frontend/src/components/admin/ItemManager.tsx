"use client";
import React, { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  inStock?: boolean;
}

const API_URL = "/admin/items";
const categories = ["Pizza", "Burger", "Sushi", "Drinks", "Dessert"];

const ItemManager = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(true);

  // Fetch items (with pagination)
  const fetchItems = () => {
    setLoading(true);
    fetch(`${API_URL}?page=${page}&page_size=${pageSize}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [page]);

  // Add item
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("inStock", String(inStock));
    if (image) formData.append("image", image);
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setName("");
      setPrice("");
      setCategory("");
      setInStock(true);
      setImage(null);
      setNotification("Item added successfully!");
      fetchItems();
    } else {
      setNotification("Failed to add item.");
    }
    setLoading(false);
  };

  // Edit item
  const handleEdit = (item: Item) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
  };

  // Save edit
  const handleSave = async (id: number) => {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, price: parseFloat(editPrice) }),
    });
    if (res.ok) {
      setEditId(null);
      setNotification("Item updated successfully!");
      fetchItems();
    } else {
      setNotification("Failed to update item.");
    }
    setLoading(false);
  };

  // Delete item
  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotification("Item deleted.");
      fetchItems();
    } else {
      setNotification("Failed to delete item.");
    }
    setDeleteId(null);
    setLoading(false);
  };

  // Filtered items
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination controls
  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Manage Items</h2>
      {notification && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{notification}</div>
      )}
      <form className="flex flex-wrap gap-2 mb-4 items-end" onSubmit={handleAdd}>
        <input
          className="border p-2 rounded w-40"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded w-32"
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          className="border p-2 rounded w-32"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded w-48"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => setInStock((v) => !v)}
          />
          In Stock
        </label>
        <button className="bg-yellow-400 px-4 py-2 rounded text-white font-semibold" type="submit" disabled={loading}>
          Add
        </button>
      </form>
      <div className="flex justify-between items-center my-4">
        <input
          className="border p-2 rounded w-1/2"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => setPage((p) => p + 1)}
            disabled={items.length < pageSize}
          >
            Next
          </button>
        </div>
      </div>
      {loading && <div className="mb-2 text-yellow-600">Loading...</div>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-yellow-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Stock Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.slice((page - 1) * pageSize, page * pageSize).map((item) => (
            <tr key={item.id}>
              <td className="p-2">
                {editId === item.id ? (
                  <input
                    className="border p-1 rounded"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Edit name"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded object-cover" />}
                    {item.name}
                  </div>
                )}
              </td>
              <td className="p-2">
                {editId === item.id ? (
                  <input
                    className="border p-1 rounded"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="Edit price"
                  />
                ) : (
                  `$${item.price}`
                )}
              </td>
              <td className="p-2">
                {item.category || <span className="text-gray-400">No category</span>}
              </td>
              <td className="p-2">
                <span className={item.inStock ? "text-green-600" : "text-red-600"}>
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                {editId === item.id ? (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleSave(item.id)} disabled={loading}>
                      Save
                    </button>
                    <button className="bg-gray-300 text-gray-700 px-2 py-1 rounded" onClick={() => setEditId(null)} disabled={loading}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(item)} disabled={loading}>
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => setDeleteId(item.id)} disabled={loading}>
                      Delete
                    </button>
                  </>
                )}
                {/* Delete confirmation dialog */}
                {deleteId === item.id && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded shadow-lg flex flex-col gap-4">
                      <span>Are you sure you want to delete <b>{item.name}</b>?</span>
                      <div className="flex gap-2 justify-end">
                        <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setDeleteId(null)} disabled={loading}>Cancel</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(item.id)} disabled={loading}>Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ItemManager;
