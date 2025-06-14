import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./reduxStore/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import persistStore from "redux-persist/es/persistStore";

createRoot(document.getElementById("root")).render(
  <StrictMode>
 
      <App />

  </StrictMode>
);
