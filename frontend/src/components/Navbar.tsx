"use client";
import React, { useState } from "react";
import UserProfile from "./UserProfile";
import CartIcon from "./CartIcon";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  return (
    <nav className="bg-yellow-400 shadow sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Yelo</span>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <ul className="hidden md:flex gap-8 text-lg font-semibold items-center">
          <li>
            <a href="#cart" className="hover:text-yellow-700 flex items-center relative">
              <CartIcon />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              )}
            </a>
          </li>
          <li><a href="#map" className="hover:text-yellow-700">Delivery Map</a></li>
          <li><UserProfile /></li>
        </ul>
      </div>
      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden bg-yellow-300 px-4 pb-4 space-y-2 text-lg font-semibold animate-fade-in-down">
          <li>
            <a href="#cart" className="block py-2 flex items-center relative" onClick={() => setOpen(false)}>
              <CartIcon />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              )}
              <span className="ml-2">Cart</span>
            </a>
          </li>
          <li><a href="#map" className="block py-2" onClick={() => setOpen(false)}>Delivery Map</a></li>
          <li><div className="py-2"><UserProfile /></div></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
