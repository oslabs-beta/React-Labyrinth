// Test Case 8 - Check for multiple props in one component
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

const root = createRoot(document.getElementById('root'));
root.render(<App />)