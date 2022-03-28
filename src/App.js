import React from "react";
import "./App.css";
import Login from "./pages/login";
import Member from "./pages/member";
import Paket from "./pages/paket";
import User from "./pages/user";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard";
import Transaksi from "./pages/transaksi";
import Home from "./pages/home";
import FormTransaksi from "./pages/formTransaksi";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navbar><Home/></Navbar>} />
          <Route path="/member" element={<Navbar><Member /></Navbar>} />
          <Route path="/login" element={<Login />} />
          <Route path="/paket" element={<Navbar><Paket /></Navbar>} />
          <Route path="/user" element={<Navbar><User /></Navbar>} />
          <Route path="/transaksi" element={<Navbar><Transaksi /></Navbar>} />
          <Route path="/formTransaksi" element={<Navbar><FormTransaksi /></Navbar>} />
        </Routes>
      </div>
    </Router>
  );
}
