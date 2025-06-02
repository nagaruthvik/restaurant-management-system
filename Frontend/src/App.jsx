import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashbaord from "./Pages/Dashboard.jsx";
import Table from "./Pages/Table.jsx";
import NavBar from "./NavBar.jsx";
import OrderLine from "./Pages/OrderLine.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex",gap: "2rem" }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashbaord />} />
          <Route path="/tables" element={<Table />} />
          <Route path="/order-line" element={<OrderLine />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
