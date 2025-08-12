// src/pages/index.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Hello() {
  return <div style={{ padding: 24 }}>✅ Minimal page rendered</div>;
}

export default function Pages() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
