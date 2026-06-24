import { createSlice } from '@reduxjs/toolkit';

// Helper: load cart from localStorage
const loadCart = () => {
  try {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: loadCart(),
    shippingAddress: JSON.parse(localStorage.getItem('shippingAddress') || 'null'),
    paymentMethod: localStorage.getItem('paymentMethod') || 'Razorpay',
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      // Unique key = product id + size
      const existingIndex = state.cartItems.findIndex(
        (i) => i.product === item.product && i.size === item.size
      );

      if (existingIndex >= 0) {
        state.cartItems[existingIndex].qty += item.qty;
      } else {
        state.cartItems.push(item);
      }

      saveCart(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const { product, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => !(i.product === product && i.size === size)
      );
      saveCart(state.cartItems);
    },

    updateQuantity: (state, action) => {
      const { product, size, qty } = action.payload;
      const item = state.cartItems.find(
        (i) => i.product === product && i.size === size
      );
      if (item) {
        item.qty = qty;
      }
      saveCart(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },

    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      saveCart(state.cartItems);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartCount = (state) =>
  state.cart.cartItems.reduce((acc, i) => acc + i.qty, 0);
export const selectCartTotal = (state) =>
  state.cart.cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);

export default cartSlice.reducer;
