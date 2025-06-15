"use client";
import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
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
        <ul className="hidden md:flex gap-8 text-lg font-semibold">
          <li><a href="#items" className="hover:text-yellow-700">Items</a></li>
          <li><a href="#cart" className="hover:text-yellow-700">Cart</a></li>
          <li><a href="#payment" className="hover:text-yellow-700">Payment</a></li>
          <li><a href="#map" className="hover:text-yellow-700">Delivery Map</a></li>
        </ul>
      </div>
      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden bg-yellow-300 px-4 pb-4 space-y-2 text-lg font-semibold animate-fade-in-down">
          <li><a href="#items" className="block py-2" onClick={() => setOpen(false)}>Items</a></li>
          <li><a href="#cart" className="block py-2" onClick={() => setOpen(false)}>Cart</a></li>
          <li><a href="#payment" className="block py-2" onClick={() => setOpen(false)}>Payment</a></li>
          <li><a href="#map" className="block py-2" onClick={() => setOpen(false)}>Delivery Map</a></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
