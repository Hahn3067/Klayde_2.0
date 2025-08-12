import React from "react";
import { useLocation } from "react-router-dom";

export default function DebugNoMatch() {
  const loc = useLocation();
  return (
    <div style={{ padding: 24 }}>
      <h2>⚠️ No route matched this URL</h2>
      <p><strong>pathname:</strong> <code>{loc.pathname}</code></p>
      <p><strong>search:</strong> <code>{loc.search}</code></p>
      <p><strong>hash:</strong> <code>{loc.hash}</code></p>
      <p>Tell me the <em>pathname</em> shown above.</p>
    </div>
  );
}
