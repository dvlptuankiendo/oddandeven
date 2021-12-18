import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AppContextProvider } from "./contexts/app.context";
import App from "./App";
import Loading from "./components/Loading";

ReactDOM.render(
  <AppContextProvider>
    <ToastContainer autoClose={2000} hideProgressBar newestOnTop />
    <Loading />
    <App />
  </AppContextProvider>,
  document.getElementById("root")
);
