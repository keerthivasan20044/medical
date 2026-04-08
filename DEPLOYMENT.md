# Deployment Guide for MediReach (Medipharm)

This project is configured for deployment on **Vercel**.

## Prerequisites
- A Vercel account.
- The project pushed to a GitHub repository (already done: `keerthivasan20044/medical`).

## Vercel Configuration
The project uses a root-level `vercel.json` and a specific build script in `package.json` to support the monorepo structure on Vercel's serverless platform.

### Environment Variables
You **MUST** set the following environment variables in your Vercel Project Settings:

#### Server Variables:
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure string for token signing.
- `CLOUDINARY_CLOUD_NAME`: For image storage.
- `CLOUDINARY_API_KEY`: For image storage.
- `CLOUDINARY_API_SECRET`: For image storage.
- `RAZORPAY_KEY_ID`: For payments.
- `RAZORPAY_KEY_SECRET`: For payments.
- `RAZORPAY_WEB_HOOK_SECRET`: For payment webhooks.
- `NODEMAILER_EMAIL`: For email notifications.
- `NODEMAILER_PASSWORD`: For email notifications.
- `TWILIO_ACCOUNT_SID`: For SMS (optional).
- `TWILIO_AUTH_TOKEN`: For SMS (optional).
- `TWILIO_PHONE_NUMBER`: For SMS (optional).
- `CLIENT_URL`: Your Vercel deployment URL (e.g., `https://medical-yourname.vercel.app`).

#### Client Variables:
- `VITE_API_URL`: `/api` (for relative proxying) or the full backend URL.

## Build Process
Vercel will automatically run:
1. `npm install` (which triggers `postinstall` to install client and server deps).
2. `npm run build` (which builds the client and copies it to the root).

## Troubleshooting 404 Errors
If you encounter 404 errors on sub-pages (e.g., `/login`, `/dashboard`):
- The `vercel.json` rewrites are already configured to redirect all non-API requests to `index.html`.
- Ensure `cleanUrls` is set to `true` (already done).

## Socket.io
**Note:** Pulse/WebSockets (`socket.io`) may have limitations on Vercel Serverless Functions. If real-time features fail, consider using a dedicated server or a service like Pusher.
