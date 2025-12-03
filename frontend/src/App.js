import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />   
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
		<Route path="/profile" element={<Profile />} />

      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
