import { useDispatch, useSelector } from 'react-redux';
import {
  addItem,
  removeItem,
  changeQty,
  clearCart,
  validateCoupon,
  clearCoupon,
  setNote,
  setTip,
  setPrescription,
  clearPrescription
} from '../store/cartSlice.js';

export function useCart() {
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart);

  return {
    ...cart,
    addItem: (item) => dispatch(addItem(item)),
    removeItem: (id) => dispatch(removeItem(id)),
    changeQty: (id, delta) => dispatch(changeQty({ id, delta })),
    clearCart: () => dispatch(clearCart()),
    applyCoupon: (code) => dispatch(validateCoupon({ code, subtotal: cart.subtotal })),
    clearCoupon: () => dispatch(clearCoupon()),
    setNote: (note) => dispatch(setNote(note)),
    setTip: (amount) => dispatch(setTip(amount)),
    setPrescription: (data) => dispatch(setPrescription(data)),
    clearPrescription: () => dispatch(clearPrescription())
  };
}
