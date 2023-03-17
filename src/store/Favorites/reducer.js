export const initialFavoritesState = {
  products: [],
};

export const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_FAVORITES": {
      let updatedProducts;
      let newState;

      const foundProduct = state.products.find(
        (product) => product.id === action.payload.id
      );

      if (foundProduct) {
        updatedProducts = state.products.map((product) => {
          if (foundProduct.id === product.id) {
            return {
              ...product,
              quantity: product.quantity + 1,
            };
          } else {
            return product;
          }
        });
      } else {
        updatedProducts = [
          ...state.products,
          {
            ...action.payload,
            quantity: 1,
          },
        ];
      }

      newState = {
        products: updatedProducts,
      };
      return newState;
    }

    case "REMOVE_FROM_FAVORITES": {
      let newState;

      const filterProducts = state.products.filter(
        (product) => product.id !== action.payload
      );

      newState = {
        products: filterProducts,
      };

      return newState;
    }
    default:
      return state;
  }
};
