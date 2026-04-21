# 🏥 MediPharm — Professional Integrated Pharmacy Platform
> **Karaikal's Most Reliable Integrated Medical Network and Digital Pharmacy Solution.**

MediPharm is a production-grade, full-stack medical platform designed for the **Karaikal district**. It connects local pharmacies, doctors, and delivery partners into a single, unified healthcare interface.

---

## 🚀 Key Platform Features

### 🔐 Secure Identity Management
- **Multi-Role Authentication**: Dedicated portals for Customers, Doctors, Pharmacists, and Delivery Partners.
- **Secure Sessions**: JWT-based authentication with secure cookie storage for data protection.
- **Identity Verification**: Integrated OTP verification and social authentication for seamless onboarding.

### 💊 Pharmacy & Inventory Management
- **Real-Time Inventory**: Live stock management for certified pharmacies in Karaikal (Apollo, MedPlus, etc.).
- **Smart Alerts**: Automated notifications for **Low Stock** and **Medicine Expiry** to ensure safety.
- **Advanced Search**: High-performance medicine lookup with instant results and smart suggestions.

### 🛰️ Logistics & Real-Time Tracking
- **Live Status Updates**: Real-time order tracking and status notifications via WebSockets.
- **Route Optimization**: Intelligent delivery routing to ensure the fastest possible arrival.
- **Secure Payments**: Industry-standard payment gateway integration via Razorpay with encrypted transactions.

### 🖼️ Prescription Management (Cloudinary)
- **Digital Records**: Secure prescription storage and management using Cloudinary's encrypted storage.
- **Automatic Optimization**: High-quality image processing and validation for medical records.
- **Patient Privacy**: Encrypted medical history as part of a secure healthcare data ecosystem.

---

## 💎 Premium User Experience

### 🛒 Seamless Checkout Process
- **Step-by-Step Flow**: Intuitive, conversion-optimized checkout logic (Login → Delivery Details → Payment).
- **Live Price Updates**: Real-time subtotal calculation and free delivery threshold feedback.
- **Safety Indicators**: Clear visual confirmation of encryption and verified medical procurement.

### 🏪 Professional Pharmacy Storefronts
- **Premium Design**: Modern, elegant interface for each pharmacy partner.
- **Reliability Metrics**: Transparent display of delivery times and fulfillment rates (e.g., "Avg. delivery in 22 mins").
- **Verified Licenses**: Clear display of professional licenses for every partner pharmacy.

### 🔬 Detailed Medical Information
- **Clear Specifications**: Easy-to-read medical data including dosage, side effects, and manufacturer details.
- **verified Symbols**: Professional icons signaling verified procurement from official distributors.
- **Patient Reviews**: Transparent rating systems to help users choose the best pharmacies.

### 📸 Digital Prescription Verification
- **Rapid Processing**: Specialized workflow for uploading and verifying prescriptions.
- **Cloud Storage**: Secure, organized storage of medical documents.
- **Pharmacy Choice**: Users can select their preferred pharmacy for prescription fulfillment.

---

## 🌟 Strategic Benefits

### 1. **District-Wide Healthcare Efficiency**
MediPharm optimizes the healthcare supply chain in Karaikal, providing patients with access to essential medicines in minutes instead of hours.

### 2. **Professional Trust Standards**
Using modern design principles and high-performance technology, the platform establishes a trustworthy presence essential for healthcare services.

### 3. **Medicine Safety Standards**
All listed medicines are verified against official pharmacy licenses. Our digital prescription workflow ensures that prescription-only medicines are dispensed only after pharmacist approval.

### 4. **Economic Empowerment**
Provides a dedicated dashboard for local delivery partners, enabling resident participation in the district's growing digital economy.

---

## 🛠️ Technical Stack
- **Frontend**: React 18, Redux Toolkit, Framer Motion, Tailwind CSS.
- **Backend**: Node.js, Express, MongoDB.
- **Cloud Services**: Cloudinary (Media), Razorpay (Payments).

---

## ⚙️ Installation & Setup

### Client Setup
```bash
cd client
npm install
npm run dev
```

### Server Setup
```bash
cd server
npm install
npm start
```

### Environment Variables
Configure your `.env` files using the templates provided in each directory. Key variables include: `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, and `CLOUDINARY_API_KEY`.

---

## 📜 Legal
**MediPharm Platform Version 2026** | Developed for the Karaikal Healthcare Network.