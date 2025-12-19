import React from "react";
import "../Css/Seeds.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Seeds() {
  const seedsList = [
    {
      id: 1,
      name: "Tomato Seeds",
      price: 120,
      img: "https://m.media-amazon.com/images/I/81ON6v-qOXL._AC_.jpg"
    },
    {
      id: 2,
      name: "Chilli Seeds",
      price: 90,
      img: "https://th.bing.com/th/id/OIP.qBHP7vJmxVtoFARWQNUAEAAAAA?w=177&h=214&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 3,
      name: "Groundnut Seeds",
      price: 150,
      img: "https://th.bing.com/th/id/OIP.UKXJV3LzcuY7lTbnnKKGwwHaHa?w=177&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 4,
      name: "Corn Seeds",
      price: 200,
      img: "https://th.bing.com/th/id/OIP.iypF96eOiZzb_HisZ5jkTwHaHa?w=196&h=196&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 5,
      name: "Carrot Seeds",
      price: 80,
      img: "https://th.bing.com/th/id/OIP.OYQb9YPtL6VtXhiI7nXn2gHaHa?w=199&h=200&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 6,
      name: "Onion Seeds",
      price: 70,
      img: "https://th.bing.com/th/id/OIP.pLpy9X99tT8PWs0Wi8EB3gHaHa?w=177&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 7,
      name: "Cabbage Seeds",
      price: 60,
      img: "https://th.bing.com/th/id/OIP.kNuhLZaGqiyCaYL1zu4s1AHaHa?w=209&h=209&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 8,
      name: "Cauliflower Seeds",
      price: 75,
      img: "https://th.bing.com/th/id/OIP.mOt_sMHJt-CWEo61BPbs7gHaHa?w=191&h=191&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 9,
      name: "Spinach Seeds",
      price: 50,
      img: "https://th.bing.com/th/id/OIP.kNuhLZaGqiyCaYL1zu4s1AHaHa?w=209&h=209&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 10,
      name: "Brinjal Seeds",
      price: 90,
      img: "https://th.bing.com/th/id/OIP.QIkbo713SyNpKFn7-CxqZgHaHm?w=208&h=214&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 11,
      name: "Okra Seeds",
      price: 85,
      img: "https://th.bing.com/th/id/OIP.5GvL5J-ZrQabTHVyIKJ8fwHaHa?w=177&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 12,
      name: "Peas Seeds",
      price: 95,
      img: "https://th.bing.com/th/id/OIP.cvk8i2rCiV5mqX4xebMfdwHaHa?w=179&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 13,
      name: "Pumpkin Seeds",
      price: 110,
      img: "https://th.bing.com/th/id/OIP.L9ZheziqPscScvTqWK3BGgHaHa?w=213&h=213&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 14,
      name: "Wheat Seeds",
      price: 45,
      img: "https://th.bing.com/th/id/OIP.y_fbednHquJ-bL6nspZ3ewAAAA?w=145&h=185&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 15,
      name: "Rice Seeds",
      price: 55,
      img: "https://th.bing.com/th/id/OIP.ZhayXn4I-CMEoHRiWb8lMgHaHJ?w=196&h=189&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    },
    {
      id: 16,
      name: "Cotton Seeds",
      price: 180,
      img: "https://th.bing.com/th/id/OIP.XW6Xn6x0GDZWXsWXkYXP1QAAAA?w=159&h=199&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    }
  ];

   // ⭐ Add to Cart Function (same as fertilizers)
    const addToCart = (item) => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const exists = cart.find((c) => c.cropId === `SEED-${item.id}`);

      if (exists) {
        exists.qty += 1;       // Increase quantity if already added
      } else {
        cart.push({
          cropId: `SEED-${item.id}`, // Unique ID for seeds
          cropName: item.name,
          price: item.price,
          qty: 1,
          images: item.img,
          availableStock: 50 // default stock for seeds
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Seeds added to cart!");
    };

    return (
      <>
        {/* ⭐ NAVBAR */}
        <Navbar />

        <div className="seeds-container" style={{ marginTop: "80px" }}>
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

                {/* ⭐ ADD TO CART BUTTON */}
                <button
                  className="seeds-btn"
                  onClick={() => addToCart(item)}
                >
                  <i className="fa fa-shopping-cart"></i> Buy Seeds
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ FOOTER */}
        <Footer />
      </>
    );
  }

export default Seeds;
