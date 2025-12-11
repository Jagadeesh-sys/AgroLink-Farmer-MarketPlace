import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import Marketplace from "./pages/Marketplace";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Seeds from "./pages/Seeds";
import Pesticides from "./pages/Pesticides";
import Fertilizers from "./pages/Fertilizers";

import Dashboard from "./pages/Dashboard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Contact from "./pages/Contact";
import LoanPage from "./pages/LoanPage";


/* ⭐ Newly Added Pages */
import Analytics from "./components/Analytics";
import MyCrops from "./components/MyCrops";
import Settings from "./components/Settings";
import Support from "./components/Support";

function App() {
  return (
    <Router>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* AUTH */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* SIDEBAR PAGES */}
        <Route path="/dashboard/mycrops" element={<MyCrops />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />

        {/* CART FLOW */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* MARKETPLACE */}
        <Route path="/marketplace" element={<Marketplace />}>
          <Route index element={<Seeds />} />
          <Route path="sell" element={<Sell />} />
          <Route path="buy" element={<Buy />} />
          <Route path="seeds" element={<Seeds />} />
          <Route path="pesticides" element={<Pesticides />} />
          <Route path="fertilizers" element={<Fertilizers />} />
        </Route>

        {/* CONTACT */}
		<Route path="/loans" element={<LoanPage />} />

        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
