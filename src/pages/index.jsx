import AuthPage from "./AuthPage";
import OAuthCallback from "./OAuthCallback";
import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";
import Search from "./Search";
import Upload from "./Upload";
import Projects from "./Projects";
import Knowledgebase from "./Knowledgebase";
import TeamManagement from "./TeamManagement";
import AIChat from "./AIChat";
import Landing from "./Landing";
import Pricing from "./Pricing";

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

const PAGES = {
  Dashboard,
  Search,
  Upload,
  Projects,
  Knowledgebase,
  TeamManagement,
  AIChat,
  Landing,
  Pricing,
};

function _getCurrentPage(url) {
  if (url.endsWith("/")) url = url.slice(0, -1);
  let urlLastPart = url.split("/").pop() || "";
  if (urlLastPart.includes("?")) urlLastPart = urlLastPart.split("?")[0];

  if (urlLastPart === "") return "Landing";

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || "Dashboard";
}

function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} /> {/* alias for buttons that point to /login */}
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* Dashboard & app routes (support both cases just in case) */}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/Search" element={<Search />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Knowledgebase" element={<Knowledgebase />} />
        <Route path="/TeamManagement" element={<TeamManagement />} />
        <Route path="/AIChat" element={<AIChat />} />

        {/* TEMP: catch-all so we never get a blank screen */}
       
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
