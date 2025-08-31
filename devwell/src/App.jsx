import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { MoodPage } from "./pages/MoodPage";
import { HydrationPage } from "./pages/HydrationPage";
import { CodingPage } from "./pages/CodingPage";
import "./index.css"; // Your main Tailwind CSS file

function App() {
  return (
    <Router>
      <Routes>
        {/* Standalone route for LandingPage */}
        <Route path="/" element={<LandingPage />} />
        {/* Authenticated routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/hydration" element={<HydrationPage />} />
          <Route path="/coding" element={<CodingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;