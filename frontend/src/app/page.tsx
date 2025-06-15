"use client";
import Navbar from "@frontend/components/Navbar";
import Login from "@frontend/components/Login";
import Items from "@frontend/components/Items";
import Cart from "@frontend/components/Cart";
import Payment from "@frontend/components/Payment";
import MapDelivery from "@frontend/components/MapDelivery";
import { useState } from "react";

export default function Home() {
  const [flow, setFlow] = useState("login");

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200">
      <Navbar />
      <header className="bg-yellow-400 shadow p-6 mb-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight drop-shadow-lg">
          Yelo Hyperlocal Delivery
        </h1>
        <p className="text-center text-gray-700 mt-2">
          Order your favorite items, track delivery, and pay seamlessly.
        </p>
      </header>
      <section className="max-w-2xl mx-auto px-4">
        {flow === "login" && (
          <div id="login">
            <Login />
            <div className="flex justify-end">
              <button
                className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded"
                onClick={() => setFlow("items")}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {flow === "items" && (
          <div id="items">
            <Items />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={() => setFlow("login")}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded"
                onClick={() => setFlow("cart")}
              >
                Go to Cart
              </button>
            </div>
          </div>
        )}
        {flow === "cart" && (
          <div id="cart">
            <Cart />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={() => setFlow("items")}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded"
                onClick={() => setFlow("payment")}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
        {flow === "payment" && (
          <div id="payment">
            <Payment />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={() => setFlow("cart")}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded"
                onClick={() => setFlow("map")}
              >
                Track Delivery
              </button>
            </div>
          </div>
        )}
        {flow === "map" && (
          <div id="map">
            <MapDelivery />
            <div className="flex justify-start mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={() => setFlow("payment")}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </section>
      <footer className="mt-12 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Yelo. All rights reserved.
      </footer>
    </main>
  );
}
