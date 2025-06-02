import React from "react";
import styles from "./NavBar.module.css";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const target = e.target.closest("svg");
    if (target) {
      const svgs = Array.from(target.parentNode.querySelectorAll("svg"));
      const index = svgs.indexOf(target);
      switch (index) {
        case 0:
          navigate("/");
          break;
        case 1:
          navigate("/tables");
          break;
        case 2:
          navigate("/order-line");
          break;

        case 3:
          window.location.href =
            "https://restaurant-management-system-blush-iota.vercel.app/";
          break;
        default:
          break;
      }
    }
  };

  return (
    <main className={styles.navbar}>
      <section className={styles.navbarProfile}></section>
      <section className={styles.navbarLinks} onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 10h3v3H2zm15 3H7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 2h2v20H3zm16 0H6v20h13c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2m-1 10H9v-2h9zm0-4H9V6h9z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M3 22V8h4v14zm7 0V2h4v20zm7 0v-8h4v8z" />
        </svg>
        <div className={styles.navbarCircle}></div>
      </section>
    </main>
  );
}
