import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import axios from "axios";
import CompactDonutBar from "../Component/PieChart";
import WeeklyLineChart from "../Component/BarGragh";
import TableDisplay from "../Component/TableDisplay";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    totalChef: 0,
    totalRevenue: 0,
    totalOrder: 0,
    totalClients: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_KEY}order/stats`
        );
        setStats(res.data);
      } catch (err) {
        setStats({
          totalChef: 0,
          totalRevenue: 0,
          totalOrder: 0,
          totalClients: 0,
        });
      }
    }
    fetchStats();
  }, []);
  const [type, setType] = useState("daily");
  const [barType, setBarType] = useState("daily");

  const [donutCounts, setDonutCounts] = useState({
    served: 0,
    dineIn: 0,
    takeAway: 0,
  });
  const [occupiedTables, setOccupiedTables] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_KEY}order/table-status`)
      .then((res) => setOccupiedTables(res.data.occupiedTables || []));
  }, []);

  const tableInfo = JSON.parse(localStorage.getItem("tableinfo") || "[]");

  useEffect(() => {
    async function fetchDonutCounts() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_KEY}order/summary?type=${type}`
        );
        setDonutCounts({
          served: res.data.served || 0,
          dineIn: res.data.dineIn || 0,
          takeAway: res.data.takeaway || 0,
        });
      } catch (err) {
        setDonutCounts({ served: 0, dineIn: 0, takeAway: 0 });
      }
    }
    fetchDonutCounts();
  }, [type]);
  const [chefStats, setChefStats] = useState([]);

  useEffect(() => {
    async function fetchChefStats() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_KEY}order/chef-stats`
        );
        setChefStats(res.data.chefs || []);
      } catch (err) {
        setChefStats([]);
      }
    }
    fetchChefStats();
  }, []);
  return (
    <div className={styles.Dashboard}>
      <div className={styles.tableHeader}>
        <div className={styles.tableCircle}></div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <div className={styles.dashboardMain}>
        <p style={{ fontSize: "1.5rem" }}>Analytics</p>
        <br />
        <section className={styles.dashboardSection1}>
          <div style={{ display: "flex" }}>
            <img src="./food.png" alt="" />
            <div className={styles.dashboarinnerPart1}>
              <p className={styles.itemDisplay}>04</p>
              <p className={styles.itemText}>TOTAL CHEF</p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <img
              style={{
                backgroundColor: "#E0EFFF",
                padding: "1.5vh 2.5vh",
                borderRadius: "40%",
              }}
              src="./money.png"
              alt=""
            />
            <div className={styles.dashboarinnerPart1}>
              <p className={styles.itemDisplay}>{stats.totalRevenue}</p>
              <p className={styles.itemText}>TOTAL REVENUE</p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <img src="./order.png" alt="" />
            <div className={styles.dashboarinnerPart1}>
              <p className={styles.itemDisplay}>{stats.totalOrder}</p>
              <p className={styles.itemText}>TOTAL ORDER</p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <img src="./people.png" alt="" />
            <div className={styles.dashboarinnerPart1}>
              <p className={styles.itemDisplay}>{stats.totalClients}</p>
              <p className={styles.itemText}>UNIQUE CLIENTS</p>
            </div>
          </div>
        </section>
        <section className={styles.dashboardSection2}>
          <div>
            <div className={styles.pychartSection1}>
              <div className={styles.pychartSection2}>
                <p>Order Summary</p>
                <p>Filter Order</p>
              </div>
              <select
                className={styles.dropdown}
                value={type}
                onChange={(e) => setType(e.target.value)}
                name=""
                id=""
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <hr />
            <div className={styles.pychartSectionPart2}>
              <div className={styles.pychartSection3}>
                <p>{donutCounts.served.toString().padStart(2, "0")}</p>
                <p>Served</p>
              </div>
              <div className={styles.pychartSection3}>
                <p>{donutCounts.dineIn.toString().padStart(2, "0")}</p>
                <p>Dine In</p>
              </div>
              <div className={styles.pychartSection3}>
                <p>{donutCounts.takeAway.toString().padStart(2, "0")}</p>
                <p>Take Away</p>
              </div>
            </div>
            <CompactDonutBar type={type} />
          </div>
          <div>
            <div className={styles.pychartSection1}>
              <div className={styles.pychartSection2}>
                <p>Revenue</p>
                <p>Filter Revenue</p>
              </div>
              <select
                className={styles.dropdown}
                value={barType}
                onChange={(e) => setBarType(e.target.value)}
                name=""
                id=""
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <hr />
            <div className={styles.pychartSectionPart2}>
              <WeeklyLineChart type={barType} />
            </div>
          </div>
          <div>
            <div className={styles.pychartSection1}>
              <div className={styles.pychartSection2}>
                <p>Tables</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className={styles.tableReserved}>
                    <div></div>
                    <p>Reserved</p>
                  </div>
                  <div className={styles.tableAvailable}>
                    <div></div>
                    <p>Reserved</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className={styles.pychartSectionPart3}>
              {tableInfo.map((table, index) => (
                <TableDisplay
                  key={index}
                  no={table.tableNo}
                  status={occupiedTables.includes(table.tableNo)}
                />
              ))}
            </div>
          </div>
        </section>
        <section>
          <h3 style={{ marginBottom: "1rem" }}>Chef Orders</h3>
          <table style={{ width: "50%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f5f3" }}>
                <th
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  Chef Name
                </th>
                <th
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  Order Taken
                </th>
              </tr>
            </thead>
            <tbody>
              {chefStats.map((chef, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "5px", border: "1px solid #ddd" }}>
                    {chef.name}
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ddd" }}>
                    {chef.count.toString().padStart(2, "0")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
