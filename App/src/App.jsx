import React from 'react';
import Menu from './Component/Menu';
import Cart from './Component/Cart';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}
