import { toast } from 'react-hot-toast';

export const toastSuccess = (message, opts) =>
  toast.success(message, { duration: 3000, ...opts });

export const toastError = (message, opts) =>
  toast.error(message, { duration: 3500, ...opts });

export const toastInfo = (message, opts) =>
  toast(message, { duration: 3000, ...opts });
