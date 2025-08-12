
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
  Dashboard: Dashboard,
  Search: Search,
  Upload: Upload,
  Projects: Projects,
  Knowledgebase: Knowledgebase,
  TeamManagement: TeamManagement,
  AIChat: AIChat,
  Landing: Landing,
  Pricing: Pricing,
};

function _getCurrentPage(url) {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split("/").pop();

  // Handle the root path explicitly
  if (urlLastPart === "") {
    return "Landing"; // This is correct, as / maps to Landing
  }

  if (urlLastPart.includes("?")) {
    urlLastPart = urlLastPart.split("?")[0];
  }

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  // Default to 'Dashboard' if no match found (or whatever your desired default is)
  return pageName || "Dashboard"; 
}
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        {/* Landing is now the default page */}
        <Route path="/" element={<Landing />} />
<Route path="/auth" element={<AuthPage />} />

        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Knowledgebase" element={<Knowledgebase />} />
        <Route path="/TeamManagement" element={<TeamManagement />} />
        <Route path="/AIChat" element={<AIChat />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />

        <Route path="*" element={<div style={{ padding: 24 }}>⚠️ No route matched this URL.</div>} />



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
