import FooterCSS from "./Footer.module.css";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`${FooterCSS.footer}`}>
      UnderFive © {currentYear}. All rights reserved.
    </div>
  );
};

export default Footer;
