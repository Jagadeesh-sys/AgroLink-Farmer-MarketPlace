import React from "react";
import "../Css/Seeds.css";

function Seeds() {
  const seedsList = [
    { id: 1, name: "Tomato Seeds", price: 120, img: "/Images/seeds_tomato.jpg" },
    { id: 2, name: "Chilli Seeds", price: 90, img: "/Images/seeds_chilli.jpg" },
    { id: 3, name: "Groundnut Seeds", price: 150, img: "/Images/seeds_groundnut.jpg" },
    { id: 4, name: "Corn Seeds", price: 200, img: "/Images/seeds_corn.jpg" }
  ];

  return (
    <div className="seeds-container">
      <h2 className="seeds-title">
        <i className="fa fa-seedling"></i> Seeds Marketplace
      </h2>

      <div className="seeds-grid">
        {seedsList.map((item) => (
          <div className="seeds-card" key={item.id}>
            <img src={item.img} alt={item.name} className="seeds-img" />

            <h3 className="seeds-name">{item.name}</h3>

            <p className="seeds-price">
              <i className="fa fa-rupee-sign"></i> {item.price}
            </p>

            <button className="seeds-btn">
              <i className="fa fa-shopping-cart"></i> Buy Seeds
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Seeds;
