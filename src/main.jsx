import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Nhập CSS mặc định của react-toastify
import "./styles/main.scss"; // <<<--- THAY ĐỔI DÒNG NÀY

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer position="bottom-right" stacked transition={Zoom} />
  </React.StrictMode>
);
