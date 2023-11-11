import { Container } from "react-bootstrap";
import FooterCSS from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`${FooterCSS.footer}`}>
      UnderFive © {currentYear}. All rights reserved.
    </div>
  );
};

export default Footer;
