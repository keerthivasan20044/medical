import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

const initialState = {
  pharmacyStocks: {}, // { pharmacyId: { medicineId: { qty: 0, lastUpdated: null } } }
  lowStockItems: [],
  isLoading: false,
  lastSocketEvent: null
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    updateMedicineStock: (state, action) => {
      const { pharmacyId, medicineId, newQty, medicineName, pharmacyName } = action.payload;
      
      if (!state.pharmacyStocks[pharmacyId]) {
        state.pharmacyStocks[pharmacyId] = {};
      }
      
      const prevQty = state.pharmacyStocks[pharmacyId][medicineId]?.qty || 0;
      state.pharmacyStocks[pharmacyId][medicineId] = {
        qty: newQty,
        lastUpdated: new Date().toISOString()
      };

      // Threshold logic (e.g., 5 units for low stock)
      if (newQty <= 5 && newQty > 0) {
        state.lowStockItems = [...new Set([...state.lowStockItems, `${pharmacyId}-${medicineId}`])];
      } else {
        state.lowStockItems = state.lowStockItems.filter(id => id !== `${pharmacyId}-${medicineId}`);
      }

      state.lastSocketEvent = { type: 'update', pharmacyId, medicineId };
    },
    
    markOutOfStock: (state, action) => {
      const { pharmacyId, medicineId, medicineName, pharmacyName } = action.payload;
      
      if (!state.pharmacyStocks[pharmacyId]) {
        state.pharmacyStocks[pharmacyId] = {};
      }
      
      state.pharmacyStocks[pharmacyId][medicineId] = {
        qty: 0,
        lastUpdated: new Date().toISOString()
      };

      state.lowStockItems = state.lowStockItems.filter(id => id !== `${pharmacyId}-${medicineId}`);
      
      toast.error(`${medicineName} went out of stock at ${pharmacyName}!`, {
        icon: '⚠️',
        duration: 5000,
        id: `out-${pharmacyId}-${medicineId}`
      });

      state.lastSocketEvent = { type: 'out', pharmacyId, medicineId };
    },
    
    markBackInStock: (state, action) => {
      const { pharmacyId, medicineId, medicineName, pharmacyName, qty } = action.payload;
      
      if (!state.pharmacyStocks[pharmacyId]) {
        state.pharmacyStocks[pharmacyId] = {};
      }
      
      state.pharmacyStocks[pharmacyId][medicineId] = {
        qty: qty,
        lastUpdated: new Date().toISOString()
      };

      toast.success(`${medicineName} is back in stock at ${pharmacyName}!`, {
        icon: '✅',
        duration: 5000,
        id: `back-${pharmacyId}-${medicineId}`
      });

      state.lastSocketEvent = { type: 'back', pharmacyId, medicineId };
    }
  }
});

export const { updateMedicineStock, markOutOfStock, markBackInStock } = stockSlice.actions;

// Selectors
export const selectStockByPharmacy = (state, pharmacyId) => state.stock.pharmacyStocks[pharmacyId] || {};
export const selectMedicineStock = (state, pharmacyId, medicineId) => state.stock.pharmacyStocks[pharmacyId]?.[medicineId] || { qty: 0 };
export const selectLowStockItems = (state) => state.stock.lowStockItems;

export default stockSlice.reducer;
