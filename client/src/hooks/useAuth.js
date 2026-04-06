import { useSelector } from 'react-redux';

export function useAuth() {
  const auth = useSelector((s) => s.auth);
  const isLoading =
    auth.status === 'loading' ||
    auth.oauthStatus === 'loading' ||
    auth.otpStatus === 'loading' ||
    auth.resetRequestStatus === 'loading' ||
    auth.resetStatus === 'loading';

  return {
    ...auth,
    isLoading,
    hasError: Boolean(auth.error)
  };
}
