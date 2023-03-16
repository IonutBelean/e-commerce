import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AllGames from "./pages/AllGames";
import "./App.css";
import Cart from "./components/Cart";
import { useReducer } from "react";
import { cartReducer, initialState } from "./store/Cart/reducer";
import { CartContext } from "./store/Cart/context";
import ActionGames from "./pages/ActionGames";
import RacingGames from "./pages/RacingGames";

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
        <Route path="/Cart" element={<Cart />} />
        <Route path="/AllGames" element={<AllGames />} />
        <Route path="/ActionGames" element={<ActionGames />} />
        <Route path="/RacingGames" element={<RacingGames />} />
      </Routes>
    </CartContext.Provider>
  );
}

export default App;
