import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobileNavOpen: false,
  notificationsOpen: false,
  cartOpen: false,
  lang: 'en'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    toggleNotifications(state) {
      state.notificationsOpen = !state.notificationsOpen;
    },
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
    },
    setCartOpen(state, action) {
      state.cartOpen = action.payload;
    },
    setLang(state, action) {
      state.lang = action.payload;
    }
  }
});

export const { toggleMobileNav, toggleNotifications, toggleCart, setCartOpen, setLang } = uiSlice.actions;
export default uiSlice.reducer;
