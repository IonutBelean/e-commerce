import Footer from "./Footer";
import Header from "./Header";

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
