import { useDispatch, useSelector } from 'react-redux';
import { confirmDeliveryOtp, resetOtp, resendOtp, verifyAccountOtp } from '../store/otpSlice.js';

export function useOtpConfirm() {
  const dispatch = useDispatch();
  const { status, error, verified, resendStatus } = useSelector((s) => s.otp);

  const confirm = async (orderId, code) => {
    return dispatch(confirmDeliveryOtp({ orderId, code }));
  };

  const confirmAccount = async (payload) => {
    return dispatch(verifyAccountOtp(payload));
  };

  const resend = async (payload) => {
    return dispatch(resendOtp(payload));
  };

  const reset = () => dispatch(resetOtp());

  return { status, error, verified, resendStatus, confirm, confirmAccount, resend, reset };
}
