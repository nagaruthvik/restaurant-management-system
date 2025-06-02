import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Order.module.css";

const OrderCard = ({
  orderId,
  item,
  tableNo,
  timeOfOrder,
  isTakeaway,
  orderStatus,
  orderItems,
  instructions,
  timeToDeliver = 30,
}) => {
  const [ongoingTime, setOngoingTime] = useState(0);
  const [status, setStatus] = useState(orderStatus);
  const [hasUpdated, setHasUpdated] = useState(false);

  const updateStatusOnServer = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_KEY}order/update/${item}`,
        {
          orderStatus: "delivered",
          chefAssigned: "none",
        }
      );
      console.log("Order updated on server:", res.data);
    } catch (err) {
      console.error("Error updating order:", err.message);
    }
  };

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const [orderHour, orderMinute] = timeOfOrder.split(":").map(Number);
      const orderDate = new Date(now);
      orderDate.setHours(orderHour, orderMinute, 0, 0);

      const diffMs = now - orderDate;
      const diffMin = Math.floor(diffMs / 60000);
      const updatedTime = diffMin >= 0 ? diffMin : 0;
      setOngoingTime(updatedTime);

      if (updatedTime >= timeToDeliver && status === "pending" && !hasUpdated) {
        setStatus("delivered");
        updateStatusOnServer();
        setHasUpdated(true);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [timeOfOrder, timeToDeliver, status, hasUpdated, orderId]);

  return (
    <div
      className={styles.cardCont}
      style={{
        backgroundColor: status === "pending" ? "#FFE3BC" : "#B9F8C9",
      }}
    >
      <section className={styles.cardPart1}>
        <div className={styles.cardPart1Det1}>
          <div
            style={{ display: "flex", maxWidth: "15vh", alignItems: "center" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="#2050c5"
                d="M6 22v-9.15q-1.35-.35-2.175-1.425T3 9V2h2v6h1V2h2v6h1V2h2v7q0 1.35-.825 2.425T8 12.85V22zm10 0v-9.525q-1.35-.45-2.175-1.887T13 7.325Q13 5.1 14.175 3.55T17 2t2.825 1.562T21 7.35q0 1.825-.825 3.25T18 12.475V22z"
              />
            </svg>
            <p>{orderId}</p>
          </div>
          <p>Table-{tableNo}</p>
          <p>{timeOfOrder}</p>
          <h4>
            {orderItems?.length || 0} item{orderItems?.length === 1 ? "" : "s"}
          </h4>
        </div>
        <div
          className={styles.cardPart1Det2}
          style={{
            backgroundColor: status === "pending" ? "#FFE3BC" : "#B9F8C9",
          }}
        >
          {isTakeaway ? (
            <p
              style={{
                color: status === "pending" ? "#FF9500" : "#34C759",
              }}
            >
              Take away
            </p>
          ) : (
            <p
              style={{
                color: status === "pending" ? "#FF9500" : "#34C759",
              }}
            >
              Dine In
            </p>
          )}
          <p>
            Ongoing:{" "}
            {status === "delivered" ? "Delivered" : `${ongoingTime} Min`}
          </p>
        </div>
      </section>
      <section className={styles.cardPart2}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              alignSelf: "baseline",
              fontSize: "0.5rem",
            }}
          >
            Cooking Instructions
          </p>
          <p
            style={{
              alignSelf: "baseline",
              fontSize: "0.5rem",
            }}
          >
            {instructions}
          </p>
        </div>

        {orderItems && orderItems.length > 0 ? (
          orderItems.map((item, index) => (
            <p key={index}>
              {item.quantity}x {item.itemName || item.name}
            </p>
          ))
        ) : (
          <p>No items</p>
        )}
      </section>

      <section
        className={styles.cardStatus}
        style={{
          backgroundColor: status === "pending" ? "#FDC474" : "#31FF65",
        }}
      >
        <p
          style={{
            color: status === "pending" ? "#D87300" : "#0E912F",
          }}
        >
          {status || "Processing"}
        </p>
        {status === "pending" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              d="M3 .5h18m-18 23h18m-15.5 0v-6l2.856-1.714a4.415 4.415 0 0 0 0-7.572L5.5 6.5v-6m13 0v6l-2.856 1.714a4.416 4.416 0 0 0 0 7.572L18.5 17.5v6"
              strokeWidth="1"
            />
          </svg>
        ) : (
          <div>
            <img src="./done.png" alt="" />
          </div>
        )}
      </section>
    </div>
  );
};

export default function OrderLine() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_KEY}order/today`);
      setData(res.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };
  console.log(data);

  return (
    <div className={styles.orderDisplay}>
      {data.length === 0 ? (
        <p>No orders for today.</p>
      ) : (
        data.map((item, index) => (
          <OrderCard
            key={item._id || item.orderId || index}
            item={item._id}
            orderId={item.orderId}
            tableNo={item.tableNo}
            timeOfOrder={item.timeOfOrder}
            isTakeaway={item.isTakeaway}
            orderStatus={item.orderStatus}
            orderItems={item.orderItems}
            timeToDeliver={item.timeToDeliver}
            instructions={item.instructions}
          />
        ))
      )}
    </div>
  );
}
