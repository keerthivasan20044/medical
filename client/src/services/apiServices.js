import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    return res.data;
  },
  
  register: async (data) => {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },
  
  verifyOTP: async (data) => {
    const res = await api.post('/api/auth/verify-otp', data);
    return res.data;
  },
  
  logout: async () => {
    const res = await api.post('/api/auth/logout');
    return res.data;
  },
  
  refresh: async () => {
    const res = await api.post('/api/auth/refresh');
    return res.data;
  },
  
  googleLogin: async (token) => {
    const res = await api.post('/api/auth/google', { token });
    return res.data;
  },

  requestLoginOtp: async (data) => {
    const res = await api.post('/api/auth/login-otp/request', data);
    return res.data;
  },

  verifyLoginOtp: async (data) => {
    const res = await api.post('/api/auth/login-otp/verify', data);
    return res.data;
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
    return res.data.item || res.data;
  },
  
  getSuggestions: async (q) => {
    const res = await api.get('/api/medicines/suggestions', { params: { q } });
    return res.data;
  },

  getByCategory: async (cat) => {
    const res = await api.get(`/api/medicines/category/${cat}`);
    return res.data;
  }
};

export const pharmacyService = {
  getAll: async (params) => {
    const res = await api.get('/api/pharmacies', { params });
    return res.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/api/pharmacies/${id}`);
    return res.data.item || res.data;
  },
  
  getNearby: async (lat, lng) => {
    const res = await api.get('/api/pharmacies/nearby', { params: { lat, lng } });
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
  
  getUsers: async () => {
    const res = await api.get('/api/admin/users');
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
    return res.data.item || res.data;
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
    const res = await api.put(`/api/prescriptions/${id}/verify`);
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
    return res.data.user || res.data.item || res.data;
  },
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
    return res.data.item || res.data;
  },

  getDoctorAppointments: async () => {
    const res = await api.get('/api/appointments/doctor');
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/api/appointments/${id}/status`, { status });
    return res.data;
  }
};

export const systemService = {
  getStats: async () => {
    const res = await api.get('/api/public/stats');
    return res.data;
  }
};
