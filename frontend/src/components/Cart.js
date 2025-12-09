import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Cart.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshCart = () => {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(saved);
    };
    refreshCart();
    window.addEventListener("focus", refreshCart);
    return () => window.removeEventListener("focus", refreshCart);
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userData"));
    if (savedUser) setUser(savedUser);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const clearCart = () => updateCart([]);

  const updateKg = (cropId, enteredQty, availableQty) => {
    let qty = Number(enteredQty);
    if (qty < 1) qty = 1;
    if (qty > availableQty) qty = availableQty;
    const updated = cart.map((item) =>
      item.cropId === cropId ? { ...item, qty } : item
    );
    updateCart(updated);
  };

  const removeItem = (id) =>
    updateCart(cart.filter((c) => c.cropId !== id));

  const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);

  // GST RATE PER CATEGORY
  const getItemGST = (item) => {
    if (item.farmerId) return 0; // Crops
    if (item.cropId.startsWith("SEED")) return 0; // Seeds
    if (item.cropId.startsWith("FERT")) return 0.05; // Fertilizers
    if (item.cropId.startsWith("PEST")) return 0.18; // Pesticides
    return 0;
  };

  // CATEGORY TOTALS
  const categoryTotal = { crops: 0, seeds: 0, fert: 0, pest: 0 };
  const gstTotal = { crops: 0, seeds: 0, fert: 0, pest: 0 };

  cart.forEach((item) => {
    const amount = item.price * item.qty;
    const gstRate = getItemGST(item);

    if (item.farmerId) {
      categoryTotal.crops += amount;
      gstTotal.crops += amount * gstRate;
    } else if (item.cropId.startsWith("SEED")) {
      categoryTotal.seeds += amount;
      gstTotal.seeds += amount * gstRate;
    } else if (item.cropId.startsWith("FERT")) {
      categoryTotal.fert += amount;
      gstTotal.fert += amount * gstRate;
    } else if (item.cropId.startsWith("PEST")) {
      categoryTotal.pest += amount;
      gstTotal.pest += amount * gstRate;
    }
  });

  // SUBTOTAL
  const subtotal =
    categoryTotal.crops +
    categoryTotal.seeds +
    categoryTotal.fert +
    categoryTotal.pest;

  // DISCOUNT
  const discountAmount = Math.round(subtotal * discountPct);
  const taxable = subtotal - discountAmount;

  // FINAL GST (ALL CATEGORIES)
  const finalGST =
    Math.round(gstTotal.crops) +
    Math.round(gstTotal.seeds) +
    Math.round(gstTotal.fert) +
    Math.round(gstTotal.pest);

  // EXTRA CHARGES
  const platformFee = 10;
  const deliveryCharge = 40;

  // GRAND TOTAL
  const grandTotal = taxable + finalGST + platformFee + deliveryCharge;

  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (code === "SAVE10") setDiscountPct(0.1);
    else setDiscountPct(0);
  };

  const getImage = (imgStr) => {
    if (!imgStr) return "/Images/noimg.png";
    if (imgStr.startsWith("http") || imgStr.startsWith("data:")) return imgStr;
    const first = imgStr.split(",")[0].trim();
    return `http://localhost:9090/backend/uploads/${first}`;
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar cartCount={cart.length} />

      <div className="dashboard-content">
        <Navbar />

        <main className="dashboard-main">
          <div className="cart-header">
            <h2>Hello, {user?.fullName} 👋</h2>
            <p>Your shopping cart summary</p>
          </div>

          <div className="cart-layout">
            {/* LEFT SIDE */}
            <div className="cart-items">
              <h2 className="cart-title">Your Cart</h2>

              {cart.length === 0 ? (
                <p className="empty-cart">
                  Your cart is empty.{" "}
                  <Link to="/marketplace" className="empty-cart-cta">
                    Explore Marketplace
                  </Link>
                </p>
              ) : (
                <div className="cart-list">
                  {cart.map((item) => {
                    const isCrop = !!item.farmerId;

                    const available =
                      Number(
                        item.availableStock ??
                          item.availableQty ??
                          item.quantity
                      ) || 0;

                    return (
                      <div className="cart-card-pro" key={item.cropId}>
                        <img
                          src={getImage(item.images)}
                          alt={item.cropName}
                          className="cart-img-pro"
                        />

                        <div className="cart-details-pro">
                          <h3>{item.cropName}</h3>

                          {isCrop && (
                            <p>
                              <b>Farmer ID:</b> {item.farmerId}
                            </p>
                          )}

                          <p>
                            <b>Price:</b> ₹{item.price}
                            {isCrop && " / kg"}
                          </p>

                          <p>
                            Available Stock:{" "}
                            <b>
                              {available} {isCrop ? "Kg" : ""}
                            </b>
                          </p>

                          {/* Qty */}
                          <div className="qty-wrapper">
                            <label>
                              <b>Buy Quantity {isCrop ? "(Kg)" : ""}</b>
                            </label>

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
                                  updateKg(
                                    item.cropId,
                                    e.target.value,
                                    available
                                  )
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
                            Item Total: <b>₹{fmt(item.price * item.qty)}</b>
                          </p>
                        </div>

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

            {/* RIGHT SIDE — ORDER SUMMARY */}
            <div className="cart-summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Crops Total</span>
                <b>₹{fmt(categoryTotal.crops)}</b>
              </div>

              <div className="summary-row">
                <span>Seeds Total</span>
                <b>₹{fmt(categoryTotal.seeds)}</b>
              </div>

              <div className="summary-row">
                <span>Fertilizers Total</span>
                <b>₹{fmt(categoryTotal.fert)}</b>
              </div>

              <div className="summary-row">
                <span>Pesticides Total</span>
                <b>₹{fmt(categoryTotal.pest)}</b>
              </div>

              <hr />

              {/* DISCOUNT DISPLAY */}
              {discountAmount > 0 && (
                <div className="summary-row">
                  <span>Discount ({Math.round(discountPct * 100)}%)</span>
                  <b style={{ color: "green" }}>-₹{fmt(discountAmount)}</b>
                </div>
              )}

              <hr />

              {/* GST */}
              <div className="summary-row">
                <span>GST (Crops 0%)</span>
                <b>₹{fmt(gstTotal.crops)}</b>
              </div>

              <div className="summary-row">
                <span>GST (Seeds 0%)</span>
                <b>₹{fmt(gstTotal.seeds)}</b>
              </div>

              <div className="summary-row">
                <span>GST (Fertilizers 5%)</span>
                <b>₹{fmt(gstTotal.fert)}</b>
              </div>

              <div className="summary-row">
                <span>GST (Pesticides 18%)</span>
                <b>₹{fmt(gstTotal.pest)}</b>
              </div>

              <hr />

              {/* EXTRA CHARGES */}
              <div className="summary-row">
                <span>Platform Fee</span>
                <b>₹{fmt(platformFee)}</b>
              </div>

              <div className="summary-row">
                <span>Delivery Charge</span>
                <b>₹{fmt(deliveryCharge)}</b>
              </div>

              <hr />

              <div className="summary-row total">
                <span>Grand Total</span>
                <b>₹{fmt(grandTotal)}</b>
              </div>

              <button
                className="checkout-btn-pro"
                disabled={cart.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              {/* Coupon */}
              <div className="coupon-row">
                <input
                  className="discount-input"
                  placeholder="Enter Discount Code (SAVE10)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button className="apply-coupon-btn" onClick={applyDiscount}>
                  Apply
                </button>
              </div>

              <button
                className="clear-cart-btn"
                disabled={cart.length === 0}
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Cart;
