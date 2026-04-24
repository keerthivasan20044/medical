# MediPharm Issues Audit

## Critical
- **Broken Imports**: `pharmacyRoutes.js` and `deliveryRoutes.js` were importing `authMiddleware.js` which does not exist. (FIXED)
- **Missing API Services**: `apiServices.js` was missing `authService`, `doctorService`, and others, causing build failures. (FIXED via restoration from history)
- **Redux Slice Error**: `authSlice.js` was missing the `logout` export required by `DashboardSidebar.jsx`. (FIXED)

## High
- **Placeholder Env Variables**: Multiple critical keys in `server/.env` and `client/.env` use placeholders (e.g., `your_razorpay_secret_node`, `your_google_places_api_key_here`).
- **Unmet Dependencies**: Initial `npm list` showed several missing packages in both client and server. (FIXED via `npm install`)

## Medium
- **Hardcoded Fallbacks**: Razorpay keys and `localhost:5001` URLs are used as fallbacks in some components and services.
- **Console Logs**: Numerous `console.log` statements remain in the codebase.

## Low
- **Port Conflicts**: Dev servers failed to start initially due to processes already occupying port 5001. (RESOLVED)
- **Linting Config**: ESLint failed due to version mismatch/missing flat config.

---
**Status**: Codebase is now building and servers are starting. Ready for Git Sync.
