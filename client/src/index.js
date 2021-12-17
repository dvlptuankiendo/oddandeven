import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { AppContextProvider } from "./contexts/app.context";
import App from "./App";

ReactDOM.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
  document.getElementById("root")
);
