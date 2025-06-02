import React, { use, useEffect, useState } from "react";
import styles from "./Cart.module.css";
import { MdClose, MdLocationOn, MdAccessTime } from "react-icons/md";
import SwipeToOrder from "./SwipeToOrder";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Bounce } from "react-toastify";

export default function Cart() {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  const [activeCategory, setActiveCategory] = useState("dinein");
  const [taxes, setTaxes] = useState(5);
  const [deliveryCharge, setDeliveryCharge] = useState(50);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addingCooking, setAddingCooking] = useState(false);
  const [instruction, setInstruction] = useState("");

  const totalTime = cartItems.reduce(
    (sum, item) =>
      sum + (item.time || item.preparationTime || 2) * item.quantity,
    0
  );

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(cartItems);
    handleSearch(search);
  }, [cartChanged, search]);

  const handleRemove = (name) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = cartItems.filter((item) => item.name !== name);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartChanged((prev) => !prev);
    alert("Item removed from cart");
  };

  const handleAddquantity = (name) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = cartItems.map((item) => {
      if (item.name === name) {
        item.quantity += 1;
      }
      return item;
    });
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartChanged((prev) => !prev);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(cartItems);
    } else {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(
        cartItems.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleRemovequantity = (name) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = cartItems.map((item) => {
      if (item.name === name) {
        item.quantity -= 1;
      }
      return item;
    });
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartChanged((prev) => !prev);
  };

  function CartChip({ img, name, price, quantity }) {
    return (
      <div className={styles.cartChip}>
        <img src={img} alt={name} />
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3vh",
              width: "100%",
            }}
          >
            <h4>{name}</h4>
            <MdClose
              color="white"
              onClick={() => handleRemove(name)}
              style={{
                cursor: "pointer",
                backgroundColor: "red",
                padding: "0.6vh",
                borderRadius: "50%",
              }}
            />
          </div>
          <p>₹ {price}</p>

          <div style={{ display: "flex", alignItems: "center", gap: "1vh" }}>
            <button
              style={{ padding: "0.5vh 1vh", borderRadius: "5px" }}
              onClick={() => handleRemovequantity(name)}
            >
              -
            </button>
            <p>{quantity}</p>

            <button
              style={{ padding: "0.5vh 1vh", borderRadius: "5px" }}
              onClick={() => handleAddquantity(name)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }
  console.log(instruction);
  return (
    <div>
      <div>
        <h1>Good evening</h1>
        <p>Place your order here</p>
      </div>

      <section className={styles.searchBar}>
        <img src="./search_1.png" alt="" />
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>
      <br />
      <section
        style={{
          maxHeight: "20vh",
          overflowY: "auto",
        }}
        className={styles.cartListSection}
      >
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <CartChip
              key={index}
              img={item.img}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
            />
          ))
        ) : (
          <p>Your cart is Empty</p>
        )}
      </section>

      <section style={{ marginTop: "1rem", textAlign: "right" }}></section>
      <br />
      <section>
        <p
          onClick={() => setAddingCooking(!addingCooking)}
          style={{
            borderBottom: "1px dotted #8c7b7b",
            color: "#8c7b7b",
            fontStyle: "italic",
            display: "inline-block",
            paddingBottom: "2px",
            margin: 0,
            backgroundColor:
              activeCategory === "instructions" ? "#e0e0e0" : "transparent",
            transition: "background 0.2s",
          }}
        >
          Add cooking instructions (optional)
        </p>
        {addingCooking && (
          <div className={styles.backgroundBlur}>
            <div className={styles.addingCooking}>
              <button
                onClick={() => setAddingCooking(false)}
                className={styles.closeBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m6.4 18.308l-.708-.708l5.6-5.6l-5.6-5.6l.708-.708l5.6 5.6l5.6-5.6l.708.708l-5.6 5.6l5.6 5.6l-.708.708l-5.6-5.6z"
                  />
                </svg>
              </button>
              <h3>Add Cooking instructions </h3>
              <input
                onChange={(e) => setInstruction(e.target.value)}
                value={instruction}
                type="text"
              />
              <p>
                The restaurant will try its best to follow your request.
                However, refunds or cancellations in this regard won’t be
                possible
              </p>
            </div>
          </div>
        )}
      </section>
      <br />
      <br />
      <section className={styles.dineIn}>
        <p
          style={{
            backgroundColor:
              activeCategory === "dinein" ? "white" : "transparent",
            cursor: "pointer",
            padding: "2vh 7vh",
            borderRadius: "4vh",
          }}
          onClick={() => setActiveCategory("dinein")}
        >
          Dine In
        </p>
        <p
          style={{
            backgroundColor:
              activeCategory === "takeaway" ? "white" : "transparent",
            cursor: "pointer",
            padding: "2vh 7vh",
            borderRadius: "4vh",
          }}
          onClick={() => setActiveCategory("takeaway")}
        >
          Take Away
        </p>
      </section>
      <section className={styles.dineInDetails}>
        {activeCategory === "dinein" && (
          <div>
            <div className={styles.dineInDetailsBox}>
              <p>item Total</p>
              <p>
                ₹
                {cartItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
              </p>
            </div>
            <div className={styles.dineInDetailsBox}>
              <p>Taxes</p>
              <p>₹{taxes}</p>
            </div>

            <div className={styles.dineInDetailsBox}>
              <h4>Grand Total</h4>
              <h4>
                ₹
                {cartItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                ) + taxes}
              </h4>
            </div>
          </div>
        )}
        {activeCategory === "takeaway" && (
          <div>
            <div className={styles.dineInDetailsBox}>
              <p>item Total</p>
              <p>
                ₹
                {cartItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
              </p>
            </div>
            <div className={styles.dineInDetailsBox}>
              <p>Delivery Charge</p>
              <p>₹{deliveryCharge}</p>
            </div>
            <div className={styles.dineInDetailsBox}>
              <p>Taxes</p>
              <p>₹{taxes}</p>
            </div>

            <div className={styles.dineInDetailsBox}>
              <h4>Grand Total</h4>
              <h4>
                ₹
                {cartItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                ) +
                  taxes +
                  deliveryCharge}
              </h4>
            </div>
          </div>
        )}
      </section>
      <hr />

      <div>
        <h4>Your details</h4>
        <div>
          <input
            style={{ border: "none" }}
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={{ border: "none" }}
            type="number"
            placeholder="Enter your Phone number"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <hr />
      {activeCategory === "dinein" && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <MdAccessTime
            color="#4AB425"
            size={22}
            style={{ marginRight: "8px" }}
          />
          <p>
            Ready In <b>{totalTime} mins</b>
          </p>
        </div>
      )}
      {activeCategory === "takeaway" && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MdLocationOn
              color="#4AB425"
              size={24}
              style={{ marginRight: "8px" }}
            />
            <p>Delivery at Home</p>
            <p style={{ margin: "0 8px" }}>-</p>
            <input
              style={{ border: "none" }}
              type="text"
              placeholder="Enter your address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MdAccessTime
              color="#4AB425"
              size={22}
              style={{ marginRight: "8px" }}
            />
            <p>
              Delivery in <b>{totalTime} mins</b>
            </p>
          </div>
        </div>
      )}

      <section>
        {name && phone && (activeCategory !== "takeaway" || address) ? (
          <SwipeToOrder
            name={name}
            phone={phone}
            address={activeCategory === "takeaway" ? address : false}
            isTakeaway={activeCategory === "takeaway"}
            time={totalTime}
            instruction={instruction}
          />
        ) : (
          <p style={{ color: "red", fontWeight: 500 }}>
            Please fill all the details
          </p>
        )}
      </section>
    </div>
  );
}
