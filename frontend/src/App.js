import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";

// Import your pages
import HomePage from "./pages/home-page/HomePage.tsx";
import LogsPage from "./pages/logs-page/LogsPage.tsx";
import Navbar from "./components/navbar/Navbar.tsx";

function App() {
  return (
 
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
