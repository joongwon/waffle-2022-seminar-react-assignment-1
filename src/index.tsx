import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
export { useMySearchParams } from "./lib/hooks";
export { useRedirectWithMessage } from "./lib/hooks";
export { ConditionalLink } from "./lib/hooks";
