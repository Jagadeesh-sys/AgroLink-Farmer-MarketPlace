import React, { useEffect, useState } from "react";
import "../Css/Cart.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Load cart when page loads or regains focus
  useEffect(() => {
    const refreshCart = () => {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(saved);
    };

    refreshCart();
    window.addEventListener("focus", refreshCart);

    return () => window.removeEventListener("focus", refreshCart);
  }, []);

  // Load logged-in user's data
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userData"));
    if (savedUser) setUser(savedUser);
  }, []);

  // Save cart to localStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Update quantity with limits
  const updateKg = (cropId, enteredQty, availableQty) => {
    let qty = Number(enteredQty);

    if (qty < 1) qty = 1;
    if (qty > availableQty) qty = availableQty;

    const updated = cart.map((item) =>
      item.cropId === cropId ? { ...item, qty } : item
    );

    updateCart(updated);
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updated = cart.filter((c) => c.cropId !== id);
    updateCart(updated);
  };

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.06);
  const total = subtotal + tax;

  const getImage = (imgStr) => {
    if (!imgStr) return "/Images/noimg.png";
    const first = imgStr.split(",")[0].trim();
    return `http://localhost:9090/backend/uploads/${first}`;
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <Sidebar cartCount={cart.length} />

      {/* Right side */}
      <div className="dashboard-content">
        <Navbar />

        <main className="dashboard-main">
          <div className="cart-header">
            <h2>Hello, {user?.fullName} 👋</h2>
            <p>Your shopping cart summary</p>
          </div>

          <div className="cart-layout">
            {/* LEFT — ITEMS */}
            <div className="cart-items">
              <h2 className="cart-title">Your Cart</h2>

              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty.</p>
              ) : (
                <div className="cart-list">
                  {cart.map((item) => {
                    // ✅ Prefer availableStock, fallback to quantity, fallback to 0
                    const available = Number(
                      item.availableStock ?? item.availableQty ?? item.quantity
                    ) || 0;

                    return (
                      <div className="cart-card-pro" key={item.cropId}>
                        {/* IMAGE */}
                        <img
                          src={getImage(item.images)}
                          alt={item.cropName}
                          className="cart-img-pro"
                        />

                        {/* DETAILS */}
                        <div className="cart-details-pro">
                          <h3>{item.cropName}</h3>

                          <p><b>Farmer ID:</b> {item.farmerId}</p>
                          <p><b>Price:</b> ₹{item.price} / kg</p>

                          <p className="available-stock">
                            Available Stock: <b>{available} Kg</b>
                          </p>

                          <p className="stock-status">
                            {available > 5 ? (
                              <span className="in-stock">✔ In Stock</span>
                            ) : available > 0 ? (
                              <span className="limited-stock">⚠ Limited Stock</span>
                            ) : (
                              <span className="out-stock">✖ Out of Stock</span>
                            )}
                          </p>

                          {/* QUANTITY SELECTOR */}
                          <div className="qty-wrapper">
                            <label><b>Buy Quantity (Kg)</b></label>
                            <div className="qty-box">
                              <button
                                onClick={() =>
                                  updateKg(item.cropId, item.qty - 1, available)
                                }
                                disabled={item.qty <= 1}
                              >
                                -
                              </button>

                              <input
                                type="number"
                                min="1"
                                max={available}
                                value={item.qty}
                                onChange={(e) =>
                                  updateKg(item.cropId, e.target.value, available)
                                }
                              />

                              <button
                                onClick={() =>
                                  updateKg(item.cropId, item.qty + 1, available)
                                }
                                disabled={item.qty >= available}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <p className="item-total">
                            Item Total: <b>₹{item.price * item.qty}</b>
                          </p>
                        </div>

                        {/* REMOVE BUTTON */}
                        <button
                          className="remove-btn-pro"
                          onClick={() => removeItem(item.cropId)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT — SUMMARY */}
            <div className="cart-summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <b>₹{subtotal}</b>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <b>₹0</b>
              </div>

              <div className="summary-row">
                <span>Taxes (6%)</span>
                <b>₹{tax}</b>
              </div>

              <hr />

              <div className="summary-row total">
                <span>Grand Total</span>
                <b>₹{total}</b>
              </div>

              <button className="checkout-btn-pro">
                Proceed to Checkout
              </button>

              <input
                className="discount-input"
                placeholder="Enter Discount Code"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Cart;
