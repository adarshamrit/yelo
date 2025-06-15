"use client";
import Navbar from "@frontend/components/Navbar";
import Login from "@frontend/components/Login";
import Items from "@frontend/components/Items";
import Cart from "@frontend/components/Cart";
import Payment from "@frontend/components/Payment";
import MapDelivery from "@frontend/components/MapDelivery";
import { useState } from "react";
import { useAuth } from "@frontend/hooks/useAuth";

export default function Home() {
  const [flow, setFlow] = useState("login");
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200">
      <Navbar />
      <header className="bg-yellow-400 shadow p-6 mb-8">
        <h1 className="glitchy-title text-4xl font-extrabold text-center text-gray-900 tracking-tight drop-shadow-lg">
          <a
            href="#items"
            onClick={() => setFlow("items")}
            className="focus:outline-none hover:underline cursor-pointer"
            title="Go to store section"
          >
            <span aria-hidden="true" className="glitchy-text">
              Yelo
            </span>
          </a>
          <span className="text-lg font-bold">: Go Hyperlocal</span>
        </h1>
        <p className="text-center text-gray-700 mt-2">
          Order your favorite items, track delivery, and pay seamlessly.
        </p>
      </header>
      <section className="max-w-2xl mx-auto px-4">
        {!isAuthenticated ? (
          <div id="login">
            <Login onLoginSuccess={() => setFlow("items")} />
          </div>
        ) : (
          <>
            {flow === "items" && (
              <div id="items">
                <Items />
                <div className="flex justify-end mt-4">
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
            {/* Default to items after login */}
            {!["items", "cart", "payment", "map"].includes(flow) &&
              setFlow("items")}
          </>
        )}
      </section>
      <footer className="mt-12 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Yelo. All rights reserved.
      </footer>
      <style jsx global>{`
        .glitchy-title {
          position: relative;
          display: inline-block;
        }
        .glitchy-text {
          position: relative;
          color: #222;
          animation: glitch 1.2s infinite linear alternate-reverse;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 red, -2px 0 blue; }
          20% { text-shadow: -2px 0 lime, 2px 0 magenta; }
          40% { text-shadow: 2px 2px cyan, -2px -2px yellow; }
          60% { text-shadow: -2px 2px orange, 2px -2px purple; }
          80% { text-shadow: 2px 0 red, -2px 0 blue; }
          100% { text-shadow: 0 0 2px #000; }
        }
      `}</style>
    </main>
  );
}
