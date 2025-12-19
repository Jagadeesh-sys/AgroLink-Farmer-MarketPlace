import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "../Css/TrackOrder.css";

function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find((o) => o.orderId === orderId);

  const steps = [
    { key: "Order Placed", desc: "We have received your order." },
    { key: "Order Confirmed", desc: "Your order has been confirmed." },
    { key: "Order Processed", desc: "We are preparing your order." },
    { key: "Delivered", desc: "Your order has been delivered." },
  ];

  const activeIndex = steps.findIndex(
    (s) => s.key === order?.status
  );

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar cartCount={0} />

        <div className="track-page">
          <main className="track-wrapper">

            {!order ? (
              <div className="track-empty">
                <h2>Order Not Found</h2>
                <p>Please check your order ID.</p>
                <button onClick={() => navigate("/myorders")}>
                  Back to Orders
                </button>
              </div>
            ) : (
              <>
                {/* HEADER */}
                <div className="track-header">
                  <h2>Track Order</h2>
                  <button onClick={() => navigate("/my-orders")}>Back</button>
                </div>

                {/* INFO BAR */}
                <div className="track-info-bar">
                  <div>
                    <span>Estimated Time</span>
                    <b>30 minutes</b>
                  </div>
                  <div>
                    <span>Order Number</span>
                    <b>{order.orderId}</b>
                  </div>
                </div>

                {/* TIMELINE */}
                <div className="timeline">
                  {steps.map((step, i) => (
                    <div className="timeline-row" key={step.key}>
                      <div
                        className={`dot ${
                          i <= activeIndex ? "active" : ""
                        }`}
                      ></div>

                      {i !== steps.length - 1 && (
                        <div
                          className={`line ${
                            i < activeIndex ? "active" : ""
                          }`}
                        ></div>
                      )}

                      <div className="timeline-content">
                        <h4>{step.key}</h4>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default TrackOrder;
