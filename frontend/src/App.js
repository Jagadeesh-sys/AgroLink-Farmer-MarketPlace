import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { apiFetch } from "./api/apiClient";

/* ===== COMMON ===== */
import Home from "./components/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

/* ===== MARKETPLACE ===== */
import Marketplace from "./pages/Marketplace";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Seeds from "./pages/Seeds";
import Pesticides from "./pages/Pesticides";
import Fertilizers from "./pages/Fertilizers";

/* ===== USER DASHBOARD ===== */
import Dashboard from "./pages/Dashboard";
import Analytics from "./components/Analytics";
import MyCrops from "./components/MyCrops";
import Settings from "./components/Settings";
import Support from "./components/Support";

/* ===== CART & ORDERS ===== */
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import TrackOrder from "./pages/TrackOrder";
import MyOrders from "./pages/MyOrders";

/* ===== OTHER ===== */
import Contact from "./pages/Contact";
import LoanPage from "./pages/LoanPage";
import InsurancePage from "./pages/InsurancePage";

/* ===== ADMIN ===== */
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [systemRole, setSystemRole] = useState(null);
  const [checked, setChecked] = useState(false);

  /* ==============================
     CHECK SESSION ROLE (ONCE)
  ============================== */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiFetch("/api/user/get-profile", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.status !== "error") {
            setSystemRole(data.systemRole || null);
          } else {
            setSystemRole(null);
          }
        } else {
          setSystemRole(null);
        }
      } catch {
        setSystemRole(null);
      } finally {
        setChecked(true); // ✅ AUTH CHECK COMPLETE
      }
    };

    checkAuth();
  }, []);

  /* 🔥 IMPORTANT: WAIT FOR AUTH CHECK */
  if (!checked) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* ===== HOME ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* ===== AUTH ===== */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* ===== USER DASHBOARD ===== */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/mycrops" element={<MyCrops />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />

        {/* ===== CART & ORDERS ===== */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/:orderId" element={<TrackOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* ===== MARKETPLACE ===== */}
        <Route path="/marketplace" element={<Marketplace />}>
          <Route index element={<Seeds />} />
          <Route path="sell" element={<Sell />} />
          <Route path="buy" element={<Buy />} />
          <Route path="seeds" element={<Seeds />} />
          <Route path="pesticides" element={<Pesticides />} />
          <Route path="fertilizers" element={<Fertilizers />} />
        </Route>

        {/* ===== SERVICES ===== */}
        <Route path="/loans" element={<LoanPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/contact" element={<Contact />} />

        {/* ===== ADMIN (PROTECTED) ===== */}
        <Route
          path="/admin"
          element={
            systemRole === "ADMIN" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
