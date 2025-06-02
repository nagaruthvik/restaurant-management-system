import React, { useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import axios from "axios";

export default function SwipeToOrder({ name, phone, address, isTakeaway,time ,instruction}) {
  const dragRef = useRef(0);

  const [dragX, setDragX] = useState(7);
  const [confirmed, setConfirmed] = useState(false);
  const dragAreaRef = useRef(null);
  const maxDrag = 320;

  const startDrag = (startX, getX) => {
    const handleMove = (e) => {
      const clientX = getX(e);
      const offset = clientX - startX;
      const clamped = Math.max(0, Math.min(offset, maxDrag));
      dragRef.current = clamped;
      setDragX(clamped);
    };

    const endDrag = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", endDrag);
      console.log(dragX);

      console.log("Final Drag:", dragRef.current);
      toast.success("Order Placed", {
        position: "top-center",
      });

      if (dragRef.current >= maxDrag) {
        setConfirmed(true);

        handleSubmitOrder();
      } else {
        setDragX(0);
      }
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", endDrag);
  };

  const handleMouseDown = (e) => {
    if (confirmed) return;
    const startX = e.clientX;
    startDrag(startX, (evt) => evt.clientX);
  };

  const handleTouchStart = (e) => {
    if (confirmed) return;
    const startX = e.touches[0].clientX;
    startDrag(startX, (evt) => evt.touches[0].clientX);
  };

  const handleSubmitOrder = async () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length === 0) {
      toast.error("Cart is empty", {
        position: "top-center",
      });
      return;
    }

    const orderData = {
      orderItems: cartItems.map((item) => ({
        itemName: item.name, // Or whatever key your item uses
        quantity: item.quantity,
        
      })),
      totalPrice: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      timeToDeliver: time || 1,
      instructions:instruction || "make it good",
      orderUserName: name || "Guest",
      orderUserPhone: phone || "9123456789",
      address:
        address && address !== "Not provided"
          ? address
          : "123, Main Street, City Center",
      timeOfOrder: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      orderStatus: "pending",
      isTakeaway: isTakeaway || false,
    };

    try {
      console.log(orderData);
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}order/new`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to place order");
      }

      console.log("Order placed successfully:", response.data);
      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order", {
        position: "top-center",
      });
    }
  };

  return (
    <div
      ref={dragAreaRef}
      style={{
        width: "90%",
        maxWidth: "45vh",
        height: "8vh",
        backgroundColor: "#f9f9f9",
        border: "2px solid #ccc",
        borderRadius: "40px",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        margin: "40px auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#888",
        }}
      >
        {confirmed ? "Order Placed!" : "Swipe to Order"}
      </div>
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: "absolute",
          top: "7%",
          left: `${dragX}px`,
          width: "7vh",
          height: "7vh",
          backgroundColor: "#ddd",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: confirmed ? "left 0.3s" : "",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: "20px" }}>→</span>
      </div>
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
    </div>
  );
}
