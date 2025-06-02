import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import axios from "axios";
import {
  GiFullPizza,
  GiHamburger,
  GiSodaCan,
  GiFrenchFries,
} from "react-icons/gi";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function handleAdd(name, price, img, size, time) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  console.log(cartItems);
  const item = {
    name: name,
    price: price,
    img: img,
    quantity: 1,
    size: size,
    time: time,
  };
  console.log(item);
  const existingItem = cartItems.find((cartItem) => cartItem.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push(item);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  toast.success("Item added to cart", {
    position: "top-center",
  });
}

function ItemChip({ img, name, price, size, time }) {
  return (
    <div className={styles.chip}>
      <img src={img} alt="Veggie Burger" />

      <div className={styles.chipBg}>
        <h3>{name}</h3>
        <div className={styles.chipPrice}>
          <p>₹ {price}</p>
          <FaPlus onClick={() => handleAdd(name, price, img, size, time)} />
        </div>
      </div>
    </div>
  );
}

export default function Menu() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);

  const navigate = useNavigate();
  const categories = [
    { name: "Burger", icon: <GiHamburger /> },
    { name: "Pizza", icon: <GiFullPizza /> },
    { name: "Drinks", icon: <GiSodaCan /> },
    { name: "French fries", icon: <GiFrenchFries /> },
    { name: "Veggies", icon: <GiSodaCan /> },
  ];

  const [apiData, setApiData] = useState([]);
  useEffect(() => {
    handleMenu();
  }, [activeCategory]);
  useEffect(() => {
    handleSearch();
  }, [search]);

  console.log(apiData);

  const onKeyPress = (button) => {
    if (button === "{bksp}" || button === "{backspace}") {
      setSearch((prev) => prev.slice(0, -1));
    } else if (button === "{space}") {
      setSearch((prev) => prev + " ");
    } else {
      setSearch((prev) => prev + button);
    }
  };

  async function handleMenu() {
    if (!activeCategory) {
      console.log("No category selected");
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}menu/item/${activeCategory.toLowerCase()}`
      );

      setApiData(response.data);
    } catch (err) {
      console.error("API error:", err);
    }
  }
  async function handleSearch() {
    if (!search) {
      console.log("No category selected");
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}menu/search/?name=${search.toLowerCase()}`
      );

      setApiData(response.data);
    } catch (err) {
      console.error("API error:", err);
    }
  }

  return (
    <main className={styles.menuMain}>
      <section>
        <h1>Good evening</h1>
        <p>Place your order here</p>
      </section>

      <section className={styles.searchBar} style={{ position: "relative" }}>
        <img src="./search_1.png" alt="" />
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowKeyboard(true)}
          value={search}
        />
        {showKeyboard && (
          <>
            <div
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                background: "#fff",
                boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              <Keyboard
                onKeyPress={onKeyPress}
                theme={"hg-theme-default hg-layout-default"}
                layout={{
                  default: [
                    "q w e r t y u i o p",
                    "a s d f g h j k l",
                    "z x c v b n m",
                    "{space} {bksp} {backspace}",
                  ],
                }}
                display={{
                  "{bksp}": "⌫",
                  "{backspace}": "Backspace",
                  "{space}": "Space",
                }}
              />
            </div>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 999,
                background: "transparent",
              }}
              onClick={() => setShowKeyboard(false)}
            />
          </>
        )}
      </section>

      <section className={styles.option}>
        {categories.map(({ name, icon }) => {
          const isActive = activeCategory === name;
          return (
            <div
              key={name}
              className={styles.box}
              onClick={() => setActiveCategory(name)}
              style={{
                backgroundColor: isActive ? "#616161" : "white",
                color: isActive ? "white" : "gray",
              }}
            >
              <span style={{ fontSize: "1.8rem" }}>{icon}</span>
              <p>{name}</p>
            </div>
          );
        })}
      </section>

      <section className="menu">
        <h1>{activeCategory}</h1>
        <div className={styles.displayItem}>
          {apiData.map((item, index) => {
            return (
              <ItemChip
                key={index}
                name={item.name}
                price={item.price}
                img={item.img}
                size={item.size}
                time={item.preparationTime}
              />
            );
          })}
        </div>
      </section>
      <footer id={styles.footer}>
        <button id={styles.nextBtn} onClick={() => navigate("/cart")}>
          Next
        </button>
      </footer>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </main>
  );
}
