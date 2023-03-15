import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import "./App.css";
import Cart from "./components/Cart";
import { useReducer } from "react";
import { cartReducer, initialState } from "./store/Cart/reducer";
import { CartContext } from "./store/Cart/context";
import Genres from "./pages/Genres";

function App() {
  const [cartState, cartDispatch] = useReducer(cartReducer, initialState);

  const cartContextValue = {
    cartState,
    cartDispatch,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Genres" element={<Genres />} />
      </Routes>
    </CartContext.Provider>
  );
}

export default App;
