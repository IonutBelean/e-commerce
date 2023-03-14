import Header from "./Header";
import Footer from "./Footer";
import HeaderSecond from "./HeaderSecond";

const Layout = (props) => {
  const { children } = props;

  return (
    <div>
      <Header />
      <HeaderSecond />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
