import api from './api.js';

export const paymentService = {
  createIntent: (orderId, method = 'razorpay') => 
    api.post('/api/payments/create-intent', { orderId, method }),
  
  confirmPayment: (data) => 
    api.post('/api/payments/confirm', data),

  getReceipts: () => 
    api.get('/api/payments/receipts'),

  getReceipt: (orderId) => 
    api.get(`/api/payments/receipt/${orderId}`, { responseType: 'blob' })
};
