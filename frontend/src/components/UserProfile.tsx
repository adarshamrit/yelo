"use client";
import React, { useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Login from "./Login";
import { HiOutlineUserCircle, HiOutlinePencil, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

const UserProfile: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Try to get username from localStorage or backend (if available)
    const user = typeof window !== "undefined" ? localStorage.getItem("yelo_user") : null;
    setUsername(user);
  }, [isAuthenticated]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-end gap-2">
        <button
          className="px-3 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 text-sm"
          onClick={() => setShowLogin(true)}
          aria-label="Login"
          title="Login"
        >
          <HiOutlineUserCircle size={32} color="#111" />
        </button>
        {showLogin && (
          <div className="absolute right-2 top-12 z-50 bg-white shadow-lg rounded p-4">
            <Login onLoginSuccess={() => setShowLogin(false)} />
            <button className="mt-2 text-xs text-gray-500 underline" onClick={() => setShowLogin(false)}>Close</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <span className="hidden md:inline text-gray-800 font-semibold text-base">
          {user?.username ? `Welcome, ${user.username}` : "Welcome"}
        </span>
        <button
          className="rounded-full bg-yellow-500 hover:bg-yellow-600 p-1 text-white focus:outline-none"
          onClick={() => setShowDropdown((v) => !v)}
          aria-label="Profile menu"
          title="Profile menu"
        >
          <HiOutlineUserCircle size={32} color="#111" />
        </button>
      </div>
      {showDropdown && (
        <div ref={dropdownRef} className="absolute right-0 top-12 z-50 bg-white shadow-lg rounded w-40 py-2">
          <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-yellow-100" onClick={() => { setShowDropdown(false); /* TODO: trigger edit profile */ }}>
            <span className="inline-flex mr-2"><HiOutlinePencil size={20} color="#111" /></span> Edit Profile
          </button>
          <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-yellow-100" onClick={logout}>
            <span className="inline-flex mr-2"><HiOutlineArrowRightOnRectangle size={20} color="#111" /></span> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
