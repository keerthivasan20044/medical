import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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

const rootReducer = combineReducers({
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
});

const persistConfig = {
  key: 'medipharm_v1',
  storage,
  whitelist: ['auth', 'cart'] // Persist auth and cart as requested
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
