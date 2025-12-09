import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Checkout.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    payment: "cod",
  });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);

    const u = JSON.parse(localStorage.getItem("userData"));
    if (u) {
      setUser(u);
      setForm((f) => ({ ...f, fullName: u.fullName || f.fullName }));
    }
  }, []);

  // ✅ FIXED IMAGE URL — based on backend/WebContent/uploads
  const getImage = (imgStr) => {
    if (!imgStr) return "/Images/noimg.png";

    const first = imgStr.split(",")[0].trim();
    return `http://localhost:9090/backend/uploads/${first}`;
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = 0;
    const tax = Math.round(subtotal * 0.06);
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cart]);

  const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);

  const canPlace =
    cart.length > 0 &&
    form.fullName.trim() &&
    form.phone.trim() &&
    form.addressLine1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.pincode.trim();

  const placeOrder = async () => {
    if (!canPlace || placing) return;
    try {
      setPlacing(true);
      await new Promise((res) => setTimeout(res, 900));

      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/dashboard", { replace: true });
      alert("Order placed successfully! Your farmer will be notified.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar cartCount={cart.length} />

        <div className="checkout-content">
          <main className="checkout-main" role="main" aria-labelledby="checkout-title">

            <header className="checkout-header">
              <div>
                <h2 id="checkout-title">Checkout</h2>
                <p>Secure your order with shipping and payment details</p>
              </div>
            </header>

            <div className="checkout-grid">

              {/* SHIPPING DETAILS */}
              <section className="card form-card" aria-label="Shipping details">
                <h3>Shipping Details</h3>

                <div className="form-row">
                  <label>Full Name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-row">
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="form-row">
                  <label>Address Line 1</label>
                  <input
                    value={form.addressLine1}
                    onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                    placeholder="House no, street"
                  />
                </div>

                <div className="form-row">
                  <label>Address Line 2</label>
                  <input
                    value={form.addressLine2}
                    onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                    placeholder="Area, landmark (optional)"
                  />
                </div>

                <div className="form-row two-col">
                  <div>
                    <label>City</label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label>State</label>
                    <input
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <label>Pincode</label>
                  <input
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="6-digit pincode"
                  />
                </div>

                {/* PAYMENT METHODS */}
                <h3>Payment Method</h3>

                <div className="payment-options" role="radiogroup">
                  <label className={`radio ${form.payment === "cod" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={form.payment === "cod"}
                      onChange={() => setForm({ ...form, payment: "cod" })}
                    />
                    <span>Cash on Delivery</span>
                  </label>

                  <label className="radio disabled" title="Coming soon">
                    <input type="radio" disabled />
                    <span>UPI (Coming Soon)</span>
                  </label>

                  <label className="radio disabled" title="Coming soon">
                    <input type="radio" disabled />
                    <span>Card (Coming Soon)</span>
                  </label>
                </div>
              </section>

              {/* ORDER SUMMARY */}
              <aside className="card summary-card" aria-label="Order summary">
                <h3>Order Summary</h3>

                {cart.length === 0 ? (
                  <p className="empty-summary">Your cart is empty.</p>
                ) : (
                  <div className="items-list">
                    {cart.map((item) => (
                      <div className="item-row" key={item.cropId}>
                        
                        {/* IMAGE FIXED HERE */}
                        <img
                          className="item-thumb"
                          src={getImage(item.images)}
                          alt={item.cropName}
                        />

                        <div className="item-meta">
                          <strong>{item.cropName}</strong>
                          <span>{item.qty} Kg × ₹{fmt(item.price)}</span>
                        </div>

                        <div className="item-line">
                          ₹{fmt(item.qty * item.price)}
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                <div className="summary-rows">
                  <div className="row">
                    <span>Subtotal</span>
                    <b>₹{fmt(totals.subtotal)}</b>
                  </div>
                  <div className="row">
                    <span>Shipping</span>
                    <b>₹{fmt(totals.shipping)}</b>
                  </div>
                  <div className="row">
                    <span>Tax (6%)</span>
                    <b>₹{fmt(totals.tax)}</b>
                  </div>
                  <div className="row total">
                    <span>Total</span>
                    <b>₹{fmt(totals.total)}</b>
                  </div>
                </div>

                <button
                  className="place-order-btn"
                  onClick={placeOrder}
                  disabled={!canPlace || placing}
                >
                  {placing ? "Placing Order..." : "Place Order"}
                </button>

                <p className="secure-note">
                  <i className="fa-solid fa-lock"></i>
                  &nbsp;Your details are safe and only shared with the seller.
                </p>

              </aside>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Checkout;
