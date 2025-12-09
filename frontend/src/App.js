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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />   {/* ⭐ ADD THIS ROUTE */}

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* Dashboard + Cart + Checkout have their own layout */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />}>
          <Route index element={<Seeds />} />
          <Route path="sell" element={<Sell />} />
          <Route path="buy" element={<Buy />} />
          <Route path="seeds" element={<Seeds />} />
          <Route path="pesticides" element={<Pesticides />} />
          <Route path="fertilizers" element={<Fertilizers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
