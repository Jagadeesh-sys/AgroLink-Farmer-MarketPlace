import React from "react";
import "../Css/Pesticides.css";

function Pesticides() {
  const pesticides = [
    { id: 1, name: "Organic Pesticide", price: 320, img: "/Images/pesticide1.jpg" },
    { id: 2, name: "Fast Action Spray", price: 450, img: "/Images/pesticide2.jpg" },
    { id: 3, name: "Insect Killer", price: 380, img: "/Images/pesticide3.jpg" },
    { id: 4, name: "Fungal Control", price: 290, img: "/Images/fungicide.jpg" }
  ];

  return (
    <div className="pesticide-container">
      <h2 className="pesticide-title">
        <i className="fa fa-vial"></i> Pesticides Store
      </h2>

      <div className="pesticide-grid">
        {pesticides.map((item) => (
          <div className="pesticide-card" key={item.id}>
            <img src={item.img} alt={item.name} className="pesticide-img" />

            <h3 className="pesticide-name">{item.name}</h3>

            <p className="pesticide-price">
              <i className="fa fa-rupee-sign"></i> {item.price}
            </p>

            <button className="pesticide-btn">
              <i className="fa fa-shopping-cart"></i> Buy Pesticide
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pesticides;
