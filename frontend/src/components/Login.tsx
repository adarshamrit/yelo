// src/components/Login.tsx
import React from "react";

const Login = () => {
  return (
    <div className="rounded-lg shadow bg-white p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-yellow-400 rounded mr-2"></span>Login
      </h2>
      <input className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" type="text" placeholder="Username" />
      <input className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" type="password" placeholder="Password" />
      <button className="w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded transition">Login</button>
    </div>
  );
};

export default Login;
