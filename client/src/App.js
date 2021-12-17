import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import { AppContext } from "./contexts/app.context";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import Home from "./pages/Home";
import Deposit from "./pages/Deposit";
import WithDraw from "./pages/WithDraw";

const App = () => {
  const { initialized, user } = useContext(AppContext);

  const renderRoutes = () => {
    if (!initialized) return <div>Loading...</div>;

    if (!user) return <AuthRoutes />;

    return <MainRoutes />;
  };

  return <Router>{renderRoutes()}</Router>;
};

export default App;

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" exact element={<Navigate replace to="/" />} />
    </Routes>
  );
};

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home isAuth={true} />} />
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/withdraw" element={<WithDraw />} />
      <Route path="*" exact element={<Navigate replace to="/" />} />
    </Routes>
  );
};
