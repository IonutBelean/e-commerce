import Footer from "./Footer";
import Header from "./Header";
import React from "react";

const LayoutSecond = (props) => {
  const { children } = props;
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default LayoutSecond;
