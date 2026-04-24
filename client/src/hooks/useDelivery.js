import { useState, useEffect } from 'react';
import { deliveryService } from '../services/apiServices';
import { socketService } from '../services/socket';
import toast from 'react-hot-toast';

export const useDelivery = () => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch available tasks
  const fetchAvailable = async () => {
    try {
      setLoading(true);
      const tasks = await deliveryService.getAvailableTasks();
      setAvailableTasks(tasks);
    } catch (err) {
      console.error('Failed to fetch available tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Accept a task
  const acceptTask = async (id) => {
    try {
      const res = await deliveryService.acceptTask(id);
      setActiveTask(res.order);
      setAvailableTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task Accepted! Heading to node...');
      return res.order;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept task');
      throw err;
    }
  };

  // Update status
  const updateStatus = async (id, status, data = {}) => {
    try {
      const res = await deliveryService.updateTaskStatus(id, status, data);
      setActiveTask(res.order);
      return res.order;
    } catch (err) {
      toast.error('Failed to update status');
      throw err;
    }
  };

  // Confirm delivery
  const confirmDelivery = async (id, otp) => {
    try {
      const res = await deliveryService.confirmDelivery(id, otp);
      setActiveTask(null);
      toast.success('Mission Accomplished! Earnings synchronized.');
      return res.order;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Verification Code');
      throw err;
    }
  };

  // Socket setup
  useEffect(() => {
    socketService.on('new_delivery_available', (task) => {
      setAvailableTasks(prev => [task, ...prev]);
      toast('New task available in your sector!', { icon: '📦' });
    });

    socketService.on('delivery_assigned', (taskId) => {
      setAvailableTasks(prev => prev.filter(t => t._id !== taskId));
    });

    return () => {
      // Cleanup listeners if needed
    };
  }, []);

  return {
    availableTasks,
    activeTask,
    loading,
    fetchAvailable,
    acceptTask,
    updateStatus,
    confirmDelivery,
    setAvailableTasks
  };
};
