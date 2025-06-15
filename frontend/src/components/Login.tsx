// src/components/Login.tsx
import React, { useState } from "react";

const API_BASE = "http://localhost:8000"; // Adjust if backend runs elsewhere

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!phone.match(/^\d{10,15}$/)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!isLogin && name.trim() === "") {
      setError("Name is required for registration.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin
        ? { phone, password }
        : { phone, password, name };
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Something went wrong");
      } else {
        setSuccess(isLogin ? "Login successful!" : "Registration successful!");
        if (isLogin && data.token) {
          localStorage.setItem("yelo_token", data.token);
          if (onLoginSuccess) onLoginSuccess();
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg shadow bg-white p-6 mb-6 max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <button
          className={`w-1/2 py-2 font-semibold rounded-l ${
            isLogin
              ? "bg-yellow-400 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`w-1/2 py-2 font-semibold rounded-r ${
            !isLogin
              ? "bg-yellow-400 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>
        {isLogin ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="text-red-500 mb-2 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 mb-2 text-sm">{success}</div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Login;
