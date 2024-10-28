import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return <></>;
}

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
