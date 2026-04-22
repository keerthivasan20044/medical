import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../services/socket.js';
import { addNotification } from '../../store/notificationsSlice.js';
import { addOrder, updateOrderInList } from '../../store/ordersSlice.js';
import { newOrderReceived, updateOrderStatus as updatePharmacistOrderStatus } from '../../store/pharmacistOrderSlice.js';
import { setPrescriptionStatus } from '../../store/orderFlowSlice.js';
import { updateMedicineStock } from '../../store/stockSlice.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { toast } from 'react-hot-toast';
import { Activity, Bell, Zap, Truck, ShieldCheck, MapPin, XCircle, CreditCard, Gift, Heart } from 'lucide-react';

export default function SocketListener() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // Identify Node with Central District Command
    if (user) {
      socket.emit('node:register', { id: user.id || user._id, role: user.role });
    }

    // --- CLINICAL STOCK TELEMETRY ---
    socket.on('stock:sync', (data) => {
      dispatch(updateMedicineStock(data));
      if (data.isLow) {
        toast(t('lowStockAlert', { name: data.name }), {
          icon: <Activity className="text-red-500" size={16}/>,
          style: { border: '1px solid #fee2e2', background: '#fef2f2', color: '#991b1b' }
        });
        if (user?.role === 'pharmacist') {
          dispatch(addNotification({ id: Date.now(), title: t('lowStockWarning'), message: t('lowStockNotify', { name: data.name }), type: 'stock', urgent: true }));
        }
      }
    });

    // --- PHARMACIST COMMAND CENTER EVENTS ---
    socket.on('order:new', (order) => {
      if (user?.role === 'pharmacist' || user?.role === 'admin') {
         dispatch(newOrderReceived(order));
         dispatch(addOrder(order));
         dispatch(addNotification({ id: Date.now(), title: t('newProtocolManifest'), message: t('incomingOrderMsg', { id: order.id || order._id }), type: 'order' }));
         toast(t('newOrderManifest'), {
            icon: <Bell className="text-brand-teal animate-bounce" size={16}/>,
            style: { border: '1px solid #02C39A', background: '#0a1628', color: '#02C39A' }
         });
         new Audio('/sounds/notification.mp3').play().catch(e => {});
      }
    });

    socket.on('order:rx-uploaded', (data) => {
       if (user?.role === 'pharmacist') {
          dispatch(addNotification({ id: Date.now(), title: t('clinicalManifestUploaded'), message: t('rxReviewMsg', { id: data.orderId }), type: 'prescription' }));
          toast(t('rxReviewActive'), {
             icon: <ShieldCheck className="text-purple-500" size={16}/>,
             style: { border: '1px solid #c084fc', background: '#0a1628', color: '#c084fc' }
          });
       }
    });

    // --- CUSTOMER SYNCHRONIZATION EVENTS ---
    socket.on('order:placed', (data) => {
       if (user?.role === 'customer') {
          dispatch(addNotification({ id: Date.now(), title: t('orderPlaced'), message: t('orderPlacedMsg', { id: data.id, pharmacyName: data.pharmacyName, eta: data.eta }), type: 'success' }));
          toast(t('orderPlacedToast', { id: data.id, pharmacyName: data.pharmacyName }), { icon: <ShieldCheck className="text-emerald-500" /> });
       }
    });

    socket.on('order:status', (data) => {
      dispatch(updateOrderInList(data));
      dispatch(updatePharmacistOrderStatus(data));
      
      if (user?.role === 'customer') {
         let msg = '';
         let icon = <Zap className="text-brand-teal" size={16}/>;
                  switch(data.status) {
            case 'confirmed': 
               msg = t('orderConfirmedBy', { name: data.pharmacyName });
               icon = <Zap className="text-blue-500" />;
               break;
            case 'preparing':
               msg = t('orderPreparingAt', { name: data.pharmacyName });
               icon = <Activity className="text-orange-500 animate-pulse" />;
               break;
            case 'out_for_delivery':
               msg = t('orderOutForDelivery', { name: data.agentName, otp: data.otp });
               icon = <Truck className="text-brand-teal animate-pulse" />;
               break;
            case 'delivered':
               msg = t('orderDeliveredSuccess', { points: data.points || 143 });
               icon = <Gift className="text-yellow-500 animate-bounce" />;
               break;
            case 'cancelled':
               msg = t('orderCancelledBy', { reason: data.reason || t('outOfStock') });
               icon = <XCircle className="text-red-500" />;
               break;
            default: msg = t('statusSyncUpdate', { status: data.status });
         }

         dispatch(addNotification({ id: Date.now(), title: t('protocolUpdate'), message: msg, type: 'status' }));
         toast(msg, { icon, style: { border: '1px solid #02C39A', background: '#0a1628', color: '#02C39A' }, duration: 6000 });
      }
    });

    socket.on('order:rx-verified', (data) => {
       if (user?.role === 'customer') {
          dispatch(setPrescriptionStatus(data.status));
          const isApproved = data.status === 'approved' || data.status === 'verified';
          const msg = isApproved 
            ? t('rxApprovedMsg') 
            : t('rxRejectedMsg', { reason: data.reason });
          
          dispatch(addNotification({ id: Date.now(), title: isApproved ? t('rxApprovedTitle') : t('rxRejectedTitle'), message: msg, type: isApproved ? 'success' : 'error' }));
          toast(msg, { 
            icon: isApproved ? <ShieldCheck className="text-emerald-500" /> : <XCircle className="text-red-500" />,
            duration: 8000
          });
       }
    });

    socket.on('order:nearby', (data) => {
       if (user?.role === 'customer') {
          const msg = t('arrivalProximity', { otp: data.otp });
          dispatch(addNotification({ id: Date.now(), title: t('proximityAlert'), message: msg, type: 'proximity' }));
          toast(msg, {
             icon: <MapPin size={16} className="text-brand-teal animate-bounce" />,
             style: { border: '3px solid #02C39A', background: '#0a1628', color: '#fff' },
             duration: 10000
          });
          new Audio('/sounds/nearby.mp3').play().catch(() => {});
       }
    });

    // --- LOGISTICS COORDINATION EVENTS ---
    socket.on('delivery:assigned', (data) => {
       if (user?.role === 'delivery') {
          dispatch(addNotification({ id: Date.now(), title: t('newMissionAssigned'), message: t('deliveryAssignmentMsg', { pharmacyName: data.pharmacyName, address: data.address, total: data.total }), type: 'assignment' }));
          toast(t('newMissionAssigned'), {
             icon: <Truck size={20} className="text-white" />,
             style: { background: '#02C39A', color: '#fff' },
             duration: 15000
          });
          new Audio('/sounds/ping.mp3').play().catch(() => {});
       }
    });

    socket.on('delivery:pickup-ready', (data) => {
       if (user?.role === 'delivery') {
          toast(t('pickupReady', { id: data.id }), {
             icon: <Activity size={16} />,
             style: { background: '#0a1628', color: '#fff' }
          });
       }
    });

    // --- REAL-TIME AUTH & ACCOUNT TELEMETRY ---
    socket.on('user:update', (data) => {
       if (user && (user.id === data.id || user._id === data.id)) {
          // If deactivated, force logout or update local status
          if (data.isActive === false) {
             toast.error(t('sessionRevoked'));
             dispatch({ type: 'auth/logout/fulfilled' }); 
             window.location.href = '/login';
          } else {
             // For verification success or role updates
             dispatch({ type: 'auth/me/fulfilled', payload: { ...user, ...data } });
             if (data.verified) {
                toast.success(t('identitySynced'));
             }
          }
       }
    });

    return () => {
      socket.off('stock:sync');
      socket.off('order:new');
      socket.off('order:rx-uploaded');
      socket.off('order:placed');
      socket.off('order:status');
      socket.off('order:rx-verified');
      socket.off('order:nearby');
      socket.off('delivery:assigned');
      socket.off('delivery:pickup-ready');
      socket.off('user:update');
    };
  }, [dispatch, user?.id, user?._id]);

  return null;
}
