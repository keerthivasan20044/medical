import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import cartReducer from './cartSlice.js';
import uiReducer from './uiSlice.js';
import medicinesReducer from './medicinesSlice.js';
import pharmaciesReducer from './pharmaciesSlice.js';
import doctorsReducer from './doctorsSlice.js';
import ordersReducer from './ordersSlice.js';
import prescriptionsReducer from './prescriptionsSlice.js';
import notificationsReducer from './notificationsSlice.js';
import paymentsReducer from './paymentsSlice.js';
import uploadReducer from './uploadSlice.js';
import otpReducer from './otpSlice.js';
import trackingReducer from './trackingSlice.js';
import stockReducer from './stockSlice.js';
import orderFlowReducer from './orderFlowSlice.js';
import pharmacistOrdersReducer from './pharmacistOrderSlice.js';
import { saveState } from '../utils/storage.js';
import { selectCartPersist } from './cartSlice.js';
import { selectAuthPersist } from './authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    medicines: medicinesReducer,
    pharmacies: pharmaciesReducer,
    doctors: doctorsReducer,
    orders: ordersReducer,
    prescriptions: prescriptionsReducer,
    notifications: notificationsReducer,
    payments: paymentsReducer,
    upload: uploadReducer,
    otp: otpReducer,
    tracking: trackingReducer,
    stock: stockReducer,
    orderFlow: orderFlowReducer,
    pharmacistOrders: pharmacistOrdersReducer
  }
});

store.subscribe(() => {
  const { cart, auth } = store.getState();
  saveState('medireach_cart_v1', selectCartPersist(cart));
  saveState('medireach_auth_v1', selectAuthPersist(auth));
});
