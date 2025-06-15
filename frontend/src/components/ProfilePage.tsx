"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import UserAddresses from "./UserAddresses";
import { useRouter } from "next/navigation";
import { HiOutlineHome } from "react-icons/hi2";

const API_BASE = "http://localhost:8000";

const ProfilePage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [morph, setMorph] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Handler to trigger morph on interaction
  const triggerMorph = () => {
    setMorph(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMorph(false), 4000);
  };

  useEffect(() => {
    // Listen for user interaction
    const handleInteract = () => triggerMorph();
    window.addEventListener("mousemove", handleInteract);
    window.addEventListener("touchstart", handleInteract);
    window.addEventListener("keydown", handleInteract);
    return () => {
      window.removeEventListener("mousemove", handleInteract);
      window.removeEventListener("touchstart", handleInteract);
      window.removeEventListener("keydown", handleInteract);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage("Profile updated successfully!");
        setEditMode(false);
      } else {
        setMessage("Failed to update profile.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <div className="p-8 text-center">Not logged in.</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8 mt-8 relative">
      {/* Animated Floating Home Bubble */}
      <button
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center transition-all duration-700 ease-in-out
          ${morph ? "w-48 rounded-2xl px-6" : "w-14 rounded-full px-0"}
          h-14 bg-yellow-400 shadow-lg text-2xl text-white hover:bg-yellow-500 focus:outline-none`}
        style={{ minWidth: morph ? 160 : 56, alignItems: 'center', gap: morph ? 12 : 0 }}
        onClick={() => router.push("/")}
        onMouseEnter={triggerMorph}
        onFocus={triggerMorph}
        title="Back to Home"
        aria-label="Back to Home"
      >
        <span className="flex items-center justify-center h-full">
          <HiOutlineHome size={32} color="#111" />
        </span>
        <span
          className={`ml-3 font-semibold text-base text-gray-900 transition-opacity duration-500 ${morph ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          style={{ transition: "opacity 0.5s, width 0.5s" }}
        >
          Back to Home
        </span>
      </button>
      <h2 className="text-2xl font-bold mb-4 text-yellow-600">Profile</h2>
      {message && (
        <div className="mb-4 text-center text-sm text-green-600">{message}</div>
      )}
      {editMode ? (
        <form onSubmit={handleSave} className="space-y-4">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            className="w-full p-2 border border-gray-300 rounded"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="w-full p-2 border border-gray-300 rounded"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            type="tel"
            required
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded font-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Name:</span> {form.username}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {form.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {form.phone}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded font-semibold"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <UserAddresses />
    </div>
  );
};

export default ProfilePage;
