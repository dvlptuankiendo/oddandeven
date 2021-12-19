import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const ContentContainer = ({ children }) => {
  return (
    <div className="vh-100 vw-100 d-flex flex-column">
      <Header />
      <div className="flex-grow-1 content-container">{children}</div>
      <Footer />
    </div>
  );
};

export default ContentContainer;
