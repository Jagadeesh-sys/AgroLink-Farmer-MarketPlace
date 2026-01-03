import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Checkout.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { buildUrl } from "../api/apiClient";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

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

  /* =========================
     LOAD CART + USER
  ========================= */
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const savedUser = JSON.parse(localStorage.getItem("userData"));
    if (savedUser) {
      setForm((f) => ({
        ...f,
        fullName: savedUser.fullName || "",
        phone: savedUser.mobile || savedUser.phone || "",
      }));
    }
  }, []);

  /* =========================
     IMAGE HANDLER – FINAL FIX ✅
  ========================= */
  const getImage = (imgStr) => {
    // ❌ no image
    if (!imgStr || imgStr.trim() === "") {
      return process.env.PUBLIC_URL + "/Images/noimg.png";
    }

    // ✅ SEEDS / EXTERNAL IMAGE
    if (imgStr.startsWith("http")) {
      return imgStr;
    }

    // ✅ FARMER CROPS (LOCAL UPLOAD)
    const list = imgStr
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    if (!list.length) {
      return process.env.PUBLIC_URL + "/Images/noimg.png";
    }

    const fileName = list[0].replace("uploads/", "");
    return buildUrl(`/uploads/${fileName}`);
  };

  /* =========================
     TOTALS
  ========================= */
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const tax = Math.round(subtotal * 0.06);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);

  /* =========================
     VALIDATION
  ========================= */
  const canPlace =
    cart.length > 0 &&
    form.fullName.trim() &&
    form.phone.trim().length === 10 &&
    form.addressLine1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.pincode.trim().length === 6;

  /* =========================
     PLACE ORDER
  ========================= */
  const placeOrder = async () => {
    if (!canPlace || placing) return;

    try {
      setPlacing(true);

      const newOrderId = "ORD-" + Date.now();
      setOrderId(newOrderId);

      await new Promise((res) => setTimeout(res, 800));

      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push({
        orderId: newOrderId,
        items: cart,
        total: totals.total,
        status: "Order Placed",
        date: new Date().toISOString(),
        address: form,
        payment: form.payment,
      });
      localStorage.setItem("orders", JSON.stringify(orders));

      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("cartUpdated"));

      setShowSuccess(true);
    } catch {
      alert("Failed to place order");
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
          <main className="checkout-main">
            <header className="checkout-header">
              <h2>Checkout</h2>
              <p>Confirm shipping and payment details</p>
            </header>

            {cart.length === 0 ? (
              <p style={{ padding: 20 }}>Your cart is empty.</p>
            ) : (
              <div className="checkout-grid">
                {/* SHIPPING */}
                <section className="card form-card">
                  <h3>Shipping Details</h3>

                  <label>Full Name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                  />

                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />

                  <label>Address Line 1</label>
                  <input
                    value={form.addressLine1}
                    onChange={(e) =>
                      setForm({ ...form, addressLine1: e.target.value })
                    }
                  />

                  <label>Address Line 2</label>
                  <input
                    value={form.addressLine2}
                    onChange={(e) =>
                      setForm({ ...form, addressLine2: e.target.value })
                    }
                  />

                  <div className="two-col">
                    <div>
                      <label>City</label>
                      <input
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label>State</label>
                      <input
                        value={form.state}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <label>Pincode</label>
                  <input
                    value={form.pincode}
                    onChange={(e) =>
                      setForm({ ...form, pincode: e.target.value })
                    }
                  />

                  <h3>Payment</h3>
                  <div className="payment-list">
                    {["cod", "gpay", "phonepe", "paytm"].map((p) => (
                      <label
                        key={p}
                        className={`pay-row ${
                          form.payment === p ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={form.payment === p}
                          onChange={() =>
                            setForm({ ...form, payment: p })
                          }
                        />
                        <span className="pay-name">
                          {p === "cod"
                            ? "Cash on Delivery"
                            : p === "gpay"
                            ? "Google Pay"
                            : p === "phonepe"
                            ? "PhonePe"
                            : "Paytm"}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* SUMMARY */}
                <aside className="card summary-card">
                  <h3>Order Summary</h3>

                  {cart.map((item) => (
                    <div className="item-row" key={item.cropId}>
                      <img
                        src={getImage(item.images)}
                        alt={item.cropName}
                        className="item-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            process.env.PUBLIC_URL + "/Images/noimg.png";
                        }}
                      />
                      <div>
                        <strong>{item.cropName}</strong>
                        <span>
                          {item.qty} × ₹{fmt(item.price)}
                        </span>
                      </div>
                      <b>₹{fmt(item.qty * item.price)}</b>
                    </div>
                  ))}

                  <div className="summary-rows">
                    <div className="row">
                      <span>Subtotal</span>
                      <b>₹{fmt(totals.subtotal)}</b>
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
                    disabled={!canPlace || placing}
                    onClick={placeOrder}
                  >
                    {placing ? "Placing Order..." : "Place Order"}
                  </button>
                </aside>
              </div>
            )}
          </main>

          <Footer />
        </div>
      </div>

      {/* SUCCESS POPUP */}
	  {/* SUCCESS POPUP */}
	        {showSuccess && (
	          <div className="success-overlay">
	            <div className="success-card">
	              <i className="fa-solid fa-circle-check success-icon"></i>
	              <h2>Order Placed!</h2>
	              <p>Your Order ID</p>
	              <b>{orderId}</b>

	              <div className="success-actions">
	                <button
	                  className="track-btn"
	                  onClick={() => navigate(`/orders/${orderId}`)}
	                >
	                  Track Order
	                </button>
	                <button
	                  className="home-btn"
	                  onClick={() => navigate("/dashboard")}
	                >
	                  Go Home
	                </button>
	              </div>
	            </div>
	          </div>
	        )}
    </>
  );
}

export default Checkout;
