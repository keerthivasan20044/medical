import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
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
    addToCart: (item) => dispatch(addToCart(item)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    incrementQty: (id) => dispatch(incrementQty(id)),
    decrementQty: (id) => dispatch(decrementQty(id)),
    clearCart: () => dispatch(clearCart()),
    applyCoupon: (code) => dispatch(validateCoupon({ code, subtotal: cart.subtotal })),
    clearCoupon: () => dispatch(clearCoupon()),
    setNote: (note) => dispatch(setNote(note)),
    setTip: (amount) => dispatch(setTip(amount)),
    setPrescription: (data) => dispatch(setPrescription(data)),
    clearPrescription: () => dispatch(clearPrescription())
  };
}
