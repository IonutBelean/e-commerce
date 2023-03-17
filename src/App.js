import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AllGames from "./pages/AllGames";
import "./App.css";
import Cart from "./pages/Cart";
import { useReducer } from "react";
import { cartReducer, initialState } from "./store/Cart/reducer";
import { CartContext } from "./store/Cart/context";
import ActionGames from "./pages/ActionGames";
import RacingGames from "./pages/RacingGames";
import ShooterGames from "./pages/ShooterGames";
import GamesDetails from "./pages/GamesDetails";
import {
  favoritesReducer,
  initialFavoritesState,
} from "./store/Favorites/reducer";
import Favorites from "./pages/Favorites";
import { FavoritesContext } from "./store/Favorites/context";

function App() {
  const [cartState, cartDispatch] = useReducer(cartReducer, initialState);
  const [favoritesState, favoritesDispatch] = useReducer(
    favoritesReducer,
    initialFavoritesState
  );

  const cartContextValue = {
    cartState,
    cartDispatch,
  };

  const favoritesContextValue = {
    favoritesState,
    favoritesDispatch,
  };

  return (
    <FavoritesContext.Provider value={favoritesContextValue}>
      <CartContext.Provider value={cartContextValue}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Favorites" element={<Favorites />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/AllGames" element={<AllGames />} />
          <Route path="/ActionGames" element={<ActionGames />} />
          <Route path="/RacingGames" element={<RacingGames />} />
          <Route path="/ShooterGames" element={<ShooterGames />} />
          <Route path="/GamesDetails/:gameId" element={<GamesDetails />} />
        </Routes>
      </CartContext.Provider>
    </FavoritesContext.Provider>
  );
}

export default App;
