import { Route, Routes } from "react-router-dom";
import { useReducer } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import React from "react";
import { useEffect } from "react";

import Home from "./pages/Home";
import AllGames from "./pages/AllGames";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import ActionGames from "./pages/ActionGames";
import RacingGames from "./pages/RacingGames";
import ShooterGames from "./pages/ShooterGames";
import GamesDetails from "./pages/GamesDetails";
import GameRecommender from "./components/GameRecommender";

import { cartReducer, initialState } from "./store/Cart/reducer";
import {
  favoritesReducer,
  initialFavoritesState,
} from "./store/Favorites/reducer";
import { CartContext } from "./store/Cart/context";
import { FavoritesContext } from "./store/Favorites/context";

function App() {
  const [initialLocalStorageState] = useLocalStorage(
    "favorites",
    initialFavoritesState
  );

  const [initialCartLocalStorageState] = useLocalStorage("cart", initialState);

  const [cartState, cartDispatch] = useReducer(
    cartReducer,
    initialCartLocalStorageState
  );

  const [favoritesState, favoritesDispatch] = useReducer(
    favoritesReducer,
    initialLocalStorageState
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartState));
  }, [cartState]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoritesState));
  }, [favoritesState]);

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
          <Route path="/recommend" element={<GameRecommender />} />
        </Routes>
      </CartContext.Provider>
    </FavoritesContext.Provider>
  );
}

export default App;
