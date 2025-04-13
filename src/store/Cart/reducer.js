export const initialState = {
  products: [],
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const foundProduct = state.products.find(
        (product) => product.id === action.payload.id
      );

      const updatedProducts = foundProduct
        ? state.products.map((product) =>
            product.id === foundProduct.id
              ? { ...product, quantity: product.quantity + 1 }
              : product
          )
        : [...state.products, { ...action.payload, quantity: 1 }];

      return { products: updatedProducts };
    }

    case "REMOVE_FROM_CART": {
      const filteredProducts = state.products.filter(
        (product) => product.id !== action.payload
      );
      return { products: filteredProducts };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const updatedProducts = state.products.map((product) =>
        product.id === id ? { ...product, quantity } : product
      );
      return { products: updatedProducts };
    }

    default:
      return state;
  }
};
