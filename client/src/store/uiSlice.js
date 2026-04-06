import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobileNavOpen: false,
  notificationsOpen: false,
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
    setLang(state, action) {
      state.lang = action.payload;
    }
  }
});

export const { toggleMobileNav, toggleNotifications, setLang } = uiSlice.actions;
export default uiSlice.reducer;
