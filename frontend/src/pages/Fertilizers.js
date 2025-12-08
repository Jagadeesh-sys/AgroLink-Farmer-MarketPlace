import React from "react";
import "../Css/Fertilizers.css";

function Fertilizers() {
  const fertList = [
    { id: 1, name: "Urea Fertilizer", price: 650, img: "/Images/urea.jpg" },
    { id: 2, name: "NPK 20-20-20", price: 900, img: "/Images/npk.jpg" },
    { id: 3, name: "Organic Compost", price: 300, img: "/Images/compost.jpg" },
    { id: 4, name: "Potash Fertilizer", price: 750, img: "/Images/potash.jpg" }
  ];

  return (
    <div className="fert-container">
      <h2 className="fert-title">
        <i className="fa fa-leaf"></i> Fertilizers & Nutrition
      </h2>

      <div className="fert-grid">
        {fertList.map((item) => (
          <div className="fert-card" key={item.id}>
            <img src={item.img} alt={item.name} className="fert-img" />

            <h3 className="fert-name">{item.name}</h3>

            <p className="fert-price">
              <i className="fa fa-rupee-sign"></i> {item.price}
            </p>

            <button className="fert-btn">
              <i className="fa fa-shopping-cart"></i> Buy Fertilizer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Fertilizers;
