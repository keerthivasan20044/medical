import api from './api';

function persistAuthToken(data) {
  if (data?.token) {
    localStorage.setItem('authToken', data.token);
  }
  return data;
}

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    return persistAuthToken(res.data);
  },
  
  register: async (data) => {
    const { photo, otp, ...payload } = data;
    const res = await api.post('/api/auth/register', payload);
    return persistAuthToken(res.data);
  },
  
  verifyOTP: async (data) => {
    const res = await api.post('/api/auth/verify-otp', data);
    return persistAuthToken(res.data);
  },
  
  logout: async () => {
    const res = await api.post('/api/auth/logout');
    localStorage.removeItem('authToken');
    return res.data;
  },
  
  refresh: async () => {
    const res = await api.post('/api/auth/refresh');
    return persistAuthToken(res.data);
  },
  
  googleLogin: async (payload) => {
    const res = await api.post('/api/auth/google', payload);
    return persistAuthToken(res.data);
  },

  requestLoginOtp: async (data) => {
    const res = await api.post('/api/auth/login-otp/request', data);
    return res.data;
  },

  verifyLoginOtp: async (data) => {
    const res = await api.post('/api/auth/login-otp/verify', data);
    return persistAuthToken(res.data);
  },
  
  uploadAvatar: async (formData) => {
    const res = await api.post('/api/auth/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

export const medicineService = {
  getAll: async (params) => {
    const res = await api.get('/api/medicines', { params });
    return res.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/api/medicines/${id}`);
    return res.data;
  },
  
  getSuggestions: async (q) => {
    const res = await api.get('/api/medicines/suggestions', { params: { q } });
    return res.data;
  },

  getByCategory: async (cat) => {
    const res = await api.get(`/api/medicines/category/${cat}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/api/medicines', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/api/medicines/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/api/medicines/${id}`);
    return res.data;
  }
};

export const pharmacyService = {
  getAll: async (params) => {
    const res = await api.get('/api/pharmacies', { params });
    return res.data;
  },

  getAdminAll: async (params) => {
    const res = await api.get('/api/pharmacies/admin/list', { params });
    return res.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/api/pharmacies/${id}`);
    return res.data;
  },
  
  getNearby: async (lat, lng) => {
    const res = await api.get('/api/pharmacies/nearby', { params: { lat, lng } });
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/api/pharmacies', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/api/pharmacies/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/api/pharmacies/${id}`);
    return res.data;
  }
};

export const orderService = {
  create: async (data) => {
    const res = await api.post('/api/orders', data);
    return res.data;
  },
  
  getUserOrders: async () => {
    const res = await api.get('/api/orders/my-orders');
    return res.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/api/orders/${id}`);
    return res.data;
  },
  
  track: async (id) => {
    const res = await api.get(`/api/orders/${id}/track`);
    return res.data;
  },
  
  getAll: async (params) => {
    const res = await api.get('/api/orders', { params });
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/api/orders/${id}/status`, { status });
    return res.data;
  }
};

export const adminService = {
  getStats: async () => {
    const res = await api.get('/api/admin/dashboard');
    return res.data;
  },
  
  getAnalytics: async () => {
    const res = await api.get('/api/admin/analytics');
    return res.data;
  },

  sendTestEmail: async (to) => {
    const res = await api.post('/api/admin/email/test', { to });
    return res.data;
  },
  
  getUsers: async (params) => {
    const res = await api.get('/api/admin/users', { params });
    return res.data;
  },

  createUser: async (data) => {
    const res = await api.post('/api/admin/users', data);
    return res.data;
  },

  updateUser: async (id, data) => {
    const res = await api.put(`/api/admin/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/api/admin/users/${id}`);
    return res.data;
  },

  toggleUserStatus: async (id) => {
    const res = await api.patch(`/api/admin/users/${id}/toggle`);
    return res.data;
  },

  toggleUserVerification: async (id) => {
    const res = await api.patch(`/api/admin/users/${id}/verify`);
    return res.data;
  }
};

export const prescriptionService = {
  upload: async (formData) => {
    const res = await api.post('/api/prescriptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  getMy: async () => {
    const res = await api.get('/api/prescriptions/me');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/prescriptions/${id}`);
    return res.data;
  },

  getAll: async (params) => {
    const res = await api.get('/api/prescriptions/admin', { params });
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/api/prescriptions/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/api/prescriptions/${id}`);
    return res.data;
  },

  getPharmacyQueue: async () => {
    const res = await api.get('/api/prescriptions/pharmacy');
    return res.data;
  },

  verify: async (id) => {
    const res = await api.put(`/api/prescriptions/${id}/approve`);
    return res.data;
  },

  reject: async (id, reason) => {
    const res = await api.put(`/api/prescriptions/${id}/reject`, { reason });
    return res.data;
  }
};

export const doctorService = {
  getAll: async (params) => {
    const res = await api.get('/api/users/doctors', { params });
    return res.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/api/users/doctors/${id}`);
    return res.data;
  }
};

export const appointmentService = {
  create: async (data) => {
    const res = await api.post('/api/appointments', data);
    return res.data;
  },
  
  getMy: async () => {
    const res = await api.get('/api/appointments/me');
    return res.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/api/appointments/${id}`);
    return res.data;
  },

  getDoctorAppointments: async () => {
    const res = await api.get('/api/appointments/doctor');
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/api/appointments/${id}/status`, { status });
    return res.data;
  },

  getAll: async (params) => {
    const res = await api.get('/api/appointments', { params });
    return res.data;
  }
};

export const systemService = {
  getStats: async () => {
    const res = await api.get('/api/public/stats');
    return res.data;
  }
};

export const deliveryService = {
  getAvailableTasks: () => api.get('/api/delivery/available').then(res => res.data),
  acceptTask: (id) => api.post(`/api/delivery/${id}/accept`).then(res => res.data),
  getActiveTask: () => api.get('/api/delivery/active').then(res => res.data),
  updateTaskStatus: (id, status, data) => api.patch(`/api/delivery/${id}/status`, { status, ...data }).then(res => res.data),
  updateLocation: (id, location) => api.patch(`/api/delivery/${id}/location`, location).then(res => res.data),
  confirmDelivery: (id, otp) => api.post(`/api/delivery/${id}/confirm`, { otp }).then(res => res.data),
  resendDeliveryOtp: (id) => api.post(`/api/delivery/${id}/resend-otp`).then(res => res.data),
  reportDisruption: (id, data) => api.post(`/api/delivery/${id}/report-disruption`, data).then(res => res.data),
  getEarnings: () => api.get('/api/delivery/earnings').then(res => res.data),
  getHistory: () => api.get('/api/delivery/history').then(res => res.data),
};

export const pharmacistService = {
  getStats: () => api.get('/api/pharmacist/stats').then(res => res.data),
  getProfile: () => api.get('/api/pharmacist/profile').then(res => res.data),
  updateProfile: (data) => api.put('/api/pharmacist/profile', data).then(res => res.data),
  getInventory: (params) => api.get('/api/pharmacist/inventory', { params }).then(res => res.data),
  getLowStock: (threshold = 10) => api.get('/api/pharmacist/low-stock', { params: { threshold } }).then(res => res.data),
  getEarnings: () => api.get('/api/pharmacist/earnings').then(res => res.data),
  getAnalytics: () => api.get('/api/pharmacist/analytics').then(res => res.data),
  getOrders: () => api.get('/api/orders/pharmacy').then(res => res.data),
  getOrdersPage: (params) => api.get('/api/orders/pharmacy', { params }).then(res => res.data),
  updateOrderStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }).then(res => res.data),
  createMedicine: (data) => api.post('/api/medicines', data).then(res => res.data),
  updateMedicine: (id, data) => api.put(`/api/medicines/${id}`, data).then(res => res.data),
  deleteMedicine: (id) => api.delete(`/api/medicines/${id}`).then(res => res.data),
};

export const notificationService = {
  getAll: () => api.get('/api/notifications').then(res => res.data),
  markRead: (id) => api.put(`/api/notifications/${id}/read`).then(res => res.data),
  markAllRead: () => api.put('/api/notifications/read/all').then(res => res.data),
  create: (data) => api.post('/api/notifications', data).then(res => res.data),
};
