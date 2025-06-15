// src/components/Login.tsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const API_BASE = "http://localhost:8000"; // Adjust if backend runs elsewhere

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const detectMethod = (value: string) => {
    if (/^\d{10,15}$/.test(value)) return "phone";
    if (/^\S+@\S+\.\S+$/.test(value)) return "email";
    return "unknown";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const method = detectMethod(identifier);
    if (method === "unknown") {
      setError("Please enter a valid phone number or email address.");
      return;
    }
    if (!isLogin && name.trim() === "") {
      setError("Name is required for registration.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!isLogin && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin
        ? (method === "phone"
            ? { phone: identifier, password }
            : { email: identifier, password })
        : (method === "phone"
            ? { phone: identifier, password, name }
            : { email: identifier, password, name });
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
          login(data.token);
          if (onLoginSuccess) onLoginSuccess();
          window.location.reload(); // Force reload to ensure session is fully initialized
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
            placeholder="Name (as per your ID)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        )}
        <div className="mb-3 relative">
          <input
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${identifier ? (detectMethod(identifier) === 'phone' ? 'border-blue-400' : detectMethod(identifier) === 'email' ? 'border-green-400' : 'border-red-400') : 'border-gray-300'}`}
            type="text"
            placeholder="Phone number or Email address"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            autoComplete="username"
          />
          {identifier && detectMethod(identifier) === 'phone' && (
            <span className="absolute right-3 top-2 text-blue-500 text-xs font-semibold">Phone</span>
          )}
          {identifier && detectMethod(identifier) === 'email' && (
            <span className="absolute right-3 top-2 text-green-600 text-xs font-semibold">Email</span>
          )}
          {identifier && detectMethod(identifier) === 'unknown' && (
            <span className="absolute right-3 top-2 text-red-500 text-xs font-semibold">Invalid</span>
          )}
        </div>
        <input
          className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isLogin ? "current-password" : "new-password"}
        />
        {error && (
          <div className="text-red-500 mb-2 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 mb-2 text-sm">{success}</div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded transition disabled:opacity-60 mt-2 shadow-md"
          disabled={loading}
        >
          {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Login;
