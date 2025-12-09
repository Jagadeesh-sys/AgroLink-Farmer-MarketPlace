import React from "react";
import "../Css/Pesticides.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Pesticides() {
  // ⭐ INSECTICIDES
  const insecticides = [
    { id: 1, name: "Confidor (Imidacloprid)", price: 480, img: "https://tse2.mm.bing.net/th/id/OIP.6LeqTh9NHRLCVfCwRr8qaQHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3&o=7&rm=3" },
    { id: 2, name: "Coragen (Chlorantraniliprole)", price: 1250, img: "https://tse2.mm.bing.net/th/id/OIP.q2GLsbxWPQggpF5Fyd0NMAHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3&o=7&rm=3" },
    { id: 3, name: "Ampligo", price: 980, img: "https://th.bing.com/th/id/OIP.htlU-nIyrk4RRu9TDf0WtwHaHZ?w=197&h=196&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 4, name: "Proclaim (Emamectin Benzoate)", price: 650, img: "https://th.bing.com/th/id/OIP.kMwuYnPSqra6ZA-hKZEJZAHaHa?w=217&h=216&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 5, name: "Regent (Fipronil)", price: 520, img: "https://tse2.mm.bing.net/th/id/OIP.orOH2wLLHGsR9HTfR9iTkQHaJ4?pid=ImgDet&w=184&h=245&c=7&dpr=1.3&o=7&rm=3" },
    { id: 6, name: "Larvin (Thiodicarb)", price: 430, img: "https://tse2.mm.bing.net/th/id/OIP.sekG_mF22Zmlu1L5G5lGGgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 7, name: "Decis (Deltamethrin)", price: 350, img: "https://th.bing.com/th/id/OIP.-RDN5tEjMCLDHBj06rP6dAHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 8, name: "Sumo (Lambda-Cyhalothrin)", price: 410, img: "https://th.bing.com/th/id/OIP.REhXdkRgMvNj6of6sQqdaAHaHa?w=188&h=188&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 9, name: "Thimet (Phorate)", price: 380, img: "https://th.bing.com/th/id/OIP.ekZ0HG6sJvcrISMOyJOCSgAAAA?w=211&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 10, name: "Malathion 50 EC", price: 260, img: "https://5.imimg.com/data5/SELLER/Default/2022/11/FC/UB/PZ/163195891/malathion-50-e-c--500x500.png" },
  ];

  // ⭐ FUNGICIDES
  const fungicides = [
    { id: 11, name: "Ridomil Gold", price: 780, img: "" },
    { id: 12, name: "Kavach (Chlorothalonil)", price: 450, img: "" },
    { id: 13, name: "Tilt (Propiconazole)", price: 520, img: "" },
    { id: 14, name: "Nativo", price: 920, img: "" },
    { id: 15, name: "Score (Difenoconazole)", price: 580, img: "" },
    { id: 16, name: "Blue Copper", price: 330, img: "" },
    { id: 17, name: "Hexasol (Hexaconazole)", price: 470, img: "" },
    { id: 18, name: "SAAF", price: 290, img: "" },
    { id: 19, name: "Melody Duo", price: 850, img: "" },
  ];

  // ⭐ HERBICIDES
  const herbicides = [
    { id: 20, name: "Roundup (Glyphosate)", price: 720, img: "" },
    { id: 21, name: "Gramoxone (Paraquat)", price: 640, img: "" },
    { id: 22, name: "Pendimethalin 30 EC (Stomp)", price: 540, img: "" },
    { id: 23, name: "Atrazine 50 WP", price: 300, img: "" },
    { id: 24, name: "Butachlor 50 EC", price: 350, img: "" },
    { id: 25, name: "2,4-D Amine Salt", price: 270, img: "" },
  ];

  // ⭐ ORGANIC / BIO-Pesticides
  const organic = [
    { id: 26, name: "NeemAzal (Neem Extract)", price: 420, img: "" },
    { id: 27, name: "Raksha Bio (Trichoderma)", price: 310, img: "" },
    { id: 28, name: "Verticillium Lecanii", price: 350, img: "" },
    { id: 29, name: "Beauveria Bassiana", price: 360, img: "" },
  ];


    // ⭐ ADD TO CART FUNCTION
    const addToCart = (item) => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const exists = cart.find((c) => c.cropId === `PEST-${item.id}`);

      if (exists) {
        exists.qty += 1;
      } else {
        cart.push({
          cropId: `PEST-${item.id}`,
          cropName: item.name,
          price: item.price,
          qty: 1,
          images: item.img || "https://via.placeholder.com/150?text=No+Image",
          availableStock: 50
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Pesticide added to cart!");
    };

    // ⭐ Card Renderer
    const renderCards = (items) =>
      items.map((item) => (
        <div className="pesticide-card" key={item.id}>
          <img
            src={item.img || "https://via.placeholder.com/150?text=No+Image"}
            alt={item.name}
            className="pesticide-img"
          />
          <h3 className="pesticide-name">{item.name}</h3>
          <p className="pesticide-price">
            <i className="fa fa-rupee-sign"></i> {item.price}
          </p>

          {/* ⭐ BUY BUTTON UPDATED */}
          <button className="pesticide-btn" onClick={() => addToCart(item)}>
            <i className="fa fa-shopping-cart"></i> Buy
          </button>
        </div>
      ));

    return (
      <>
        <Navbar />

        <div className="pesticide-container" style={{ marginTop: "80px" }}>
          <h2 className="pesticide-title">
            <i className="fa fa-vial"></i> Pesticides Store
          </h2>

          <h2 className="category-title"><i className="fa fa-bug"></i> Insecticides</h2>
          <div className="pesticide-grid">{renderCards(insecticides)}</div>

          <h2 className="category-title"><i className="fa fa-vial-virus"></i> Fungicides</h2>
          <div className="pesticide-grid">{renderCards(fungicides)}</div>

          <h2 className="category-title"><i className="fa fa-leaf"></i> Herbicides</h2>
          <div className="pesticide-grid">{renderCards(herbicides)}</div>

          <h2 className="category-title"><i className="fa fa-seedling"></i> Organic / Bio-Pesticides</h2>
          <div className="pesticide-grid">{renderCards(organic)}</div>
        </div>

        <Footer />
      </>
    );
  }
export default Pesticides;
