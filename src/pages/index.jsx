// src/pages/index.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Layout from "./Layout.jsx";
import Landing from "./Landing";
import Pricing from "./Pricing";
import AuthPage from "./AuthPage";
import OAuthCallback from "./OAuthCallback";

import Dashboard from "./Dashboard";
import Search from "./Search";
import Upload from "./Upload";
import Projects from "./Projects";
import Knowledgebase from "./Knowledgebase";
import TeamManagement from "./TeamManagement";
import AIChat from "./AIChat";

// Helper to keep your header highlighting working
function getCurrentPage(pathname) {
  const last = (pathname.split("/").filter(Boolean).pop() || "").toLowerCase();
  if (!last) return "Landing";
  const pages = [
    "dashboard",
    "search",
    "upload",
    "projects",
    "knowledgebase",
    "teammanagement",
    "aichat",
    "landing",
    "pricing",
  ];
  const match = pages.find((p) => p === last);
  // default to Dashboard if unknown
  return match ? match.charAt(0).toUpperCase() + match.slice(1) : "Dashboard";
}

function PagesContent() {
  const location = useLocation();
  const currentPage = getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} /> {/* alias */}
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* App routes (support both cases just in case) */}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/Search" element={<Search />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Knowledgebase" element={<Knowledgebase />} />
        <Route path="/TeamManagement" element={<TeamManagement />} />
        <Route path="/AIChat" element={<AIChat />} />

        {/* Fallback: send unknown paths to Landing to avoid blank screen */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Layout>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
