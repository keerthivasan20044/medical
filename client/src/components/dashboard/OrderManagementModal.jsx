import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Phone,
  Pill,
  Store,
  Truck,
  User,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '../../services/apiServices';
import { socketService } from '../../services/socket';
import LiveDeliveryMap from '../maps/LiveDeliveryMap.jsx';

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered'];

const STATUS_META = {
  pending: { label: 'Pending', icon: Clock, tone: 'bg-amber-50 text-amber-700 border-amber-100' },
  confirmed: { label: 'Confirmed', icon: CheckCircle2, tone: 'bg-blue-50 text-blue-700 border-blue-100' },
  preparing: { label: 'Preparing', icon: Package, tone: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  'out for delivery': { label: 'Out for Delivery', icon: Truck, tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  delivered: { label: 'Delivered', icon: CheckCircle2, tone: 'bg-green-50 text-green-700 border-green-100' },
  cancelled: { label: 'Cancelled', icon: AlertCircle, tone: 'bg-red-50 text-red-700 border-red-100' }
};

const formatDateTime = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const pointFromGeo = (value) => {
  const coordinates = value?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length === 2) {
    return { lng: coordinates[0], lat: coordinates[1] };
  }
  return null;
};

const pointFromTrackingPayload = (payload) => {
  const source = payload?.location || payload?.liveLocation || payload;
  const lat = Number(source?.lat);
  const lng = Number(source?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    lat,
    lng,
    accuracy: payload?.accuracy ?? source?.accuracy,
    heading: payload?.heading ?? source?.heading,
    speed: payload?.speed ?? source?.speed,
    timestamp: payload?.timestamp || source?.timestamp || new Date().toISOString()
  };
};

export default function OrderManagementModal({ order, onClose, onUpdated, title = 'Manage Order' }) {
  const user = useSelector((state) => state.auth?.user);
  const [fullOrder, setFullOrder] = useState(order);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState('');

  const orderId = order?._id || order?.id;
  const currentStatus = fullOrder?.status || order?.status || 'pending';
  const isPage = currentStatus === 'delivered' || currentStatus === 'cancelled';

  useEffect(() => {
    if (!orderId) return;

    const load = async () => {
      try {
        setLoading(true);
        const [detail, track] = await Promise.allSettled([
          orderService.getById(orderId),
          orderService.track(orderId)
        ]);
        if (detail.status === 'fulfilled') setFullOrder(detail.value.item || detail.value.order || detail.value);
        if (track.status === 'fulfilled') setTracking(track.value.item || track.value);
      } catch (err) {
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    const sock = socketService.socket || socketService.connect(user?.id || user?._id, user?.role || 'admin');
    sock.emit('order:track-subscribe', { orderId });

    const handleLocationUpdate = (payload) => {
      if (String(payload?.orderId) !== String(orderId)) return;

      const liveLocation = pointFromTrackingPayload(payload);
      if (!liveLocation) return;

      setTracking((prev) => ({
        ...(prev || {}),
        liveLocation,
        eta: payload.eta || prev?.eta,
        status: payload.mainStatus || payload.status || prev?.status
      }));

      if (payload.mainStatus || payload.status) {
        setFullOrder((prev) => ({
          ...(prev || order),
          status: payload.mainStatus || prev?.status,
          deliveryStatus: payload.status || prev?.deliveryStatus
        }));
      }
    };

    const handleStatusUpdate = (payload) => {
      if (String(payload?.orderId) !== String(orderId)) return;
      setFullOrder((prev) => ({ ...(prev || order), status: payload.status || prev?.status }));
    };

    sock.on('order:location-update', handleLocationUpdate);
    sock.on('order:status-update', handleStatusUpdate);

    return () => {
      sock.off('order:location-update', handleLocationUpdate);
      sock.off('order:status-update', handleStatusUpdate);
    };
  }, [orderId, order, user?.id, user?._id, user?.role]);

  const statusIndex = useMemo(() => STATUS_FLOW.indexOf(currentStatus), [currentStatus]);

  const updateStatus = async (status) => {
    if (!orderId || status === currentStatus) return;
    try {
      setUpdatingStatus(status);
      const data = await orderService.updateStatus(orderId, status);
      const updated = data.item || data.order || { ...fullOrder, status };
      setFullOrder(updated);
      toast.success(`Order marked as ${status}`);
      onUpdated?.(updated);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus('');
    }
  };

  if (!order) return null;

  const customer = fullOrder?.customerId || order.customerId || {};
  const pharmacy = fullOrder?.pharmacyId || order.pharmacyId || {};
  const items = fullOrder?.items || order.items || [];
  const StatusIcon = STATUS_META[currentStatus]?.icon || Clock;
  const pharmacyLocation = pointFromGeo(pharmacy?.location);
  const driverLocation = tracking?.liveLocation || pointFromGeo(fullOrder?.deliveryLocation);

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-navy/70 p-3 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 md:p-7">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-teal">{title}</div>
            <h2 className="mt-1 font-syne text-2xl font-black uppercase text-navy md:text-3xl">
              {fullOrder?.orderNumber || order.orderNumber || 'Order'}
            </h2>
            <p className="mt-1 text-xs font-bold text-navy/40">Created {formatDateTime(fullOrder?.createdAt || order.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-navy/40 hover:bg-red-50 hover:text-red-600"
            aria-label="Close order manager"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 md:p-7">
          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center text-sm font-bold text-navy/40">
              Loading order details...
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${STATUS_META[currentStatus]?.tone || STATUS_META.pending.tone}`}>
                      <StatusIcon size={14} /> {STATUS_META[currentStatus]?.label || currentStatus}
                    </div>
                    <div className="text-sm font-black text-navy">
                      Rs.{Number(fullOrder?.totalAmount || order.totalAmount || 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-5">
                    {STATUS_FLOW.map((status, idx) => {
                      const isDone = statusIndex >= idx || currentStatus === 'delivered';
                      const isActive = currentStatus === status;
                      return (
                        <button
                          key={status}
                          onClick={() => updateStatus(status)}
                          disabled={isPage || updatingStatus === status}
                          className={`rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isActive
                              ? 'border-brand-teal bg-brand-teal text-white'
                              : isDone
                                ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                                : 'border-gray-100 bg-gray-50 text-navy/40 hover:border-brand-teal/30 hover:text-navy'
                          }`}
                        >
                          <div className="text-[9px] font-black uppercase tracking-widest">Step {idx + 1}</div>
                          <div className="mt-1 text-xs font-black uppercase leading-tight">{STATUS_META[status].label}</div>
                        </button>
                      );
                    })}
                  </div>

                  {!isPage && (
                    <button
                      onClick={() => updateStatus('cancelled')}
                      disabled={!!updatingStatus}
                      className="mt-4 h-11 rounded-xl border border-red-100 bg-red-50 px-5 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      Cancel Order
                    </button>
                  )}
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-5">
                  <h3 className="font-syne text-lg font-black uppercase text-navy">Items</h3>
                  <div className="mt-4 space-y-3">
                    {items.map((item, index) => {
                      const medicine = item.medicine || item;
                      return (
                        <div key={medicine?._id || index} className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-teal">
                              <Pill size={18} />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-black text-navy">{medicine?.name || item.name || 'Medicine'}</div>
                              <div className="text-xs font-bold text-navy/40">{medicine?.brand || medicine?.category || 'Medicine'} x {item.quantity || 1}</div>
                            </div>
                          </div>
                          <div className="shrink-0 text-sm font-black text-navy">Rs.{Number((item.price || medicine?.price || 0) * (item.quantity || 1)).toLocaleString()}</div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <section className="rounded-2xl bg-navy p-5 text-white">
                  <h3 className="font-syne text-lg font-black uppercase">Customer</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="text-brand-teal" size={18} />
                      <span className="font-bold">{customer.name || 'Guest Customer'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-brand-teal" size={18} />
                      <span className="font-bold text-white/70">{customer.phone || 'Phone not available'}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 text-brand-teal" size={18} />
                      <span className="font-bold text-white/70">{fullOrder?.deliveryAddress || order.deliveryAddress || 'Address not available'}</span>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-5">
                  <h3 className="font-syne text-lg font-black uppercase text-navy">Fulfillment</h3>
                  <div className="mt-4 space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Store className="mt-0.5 text-brand-teal" size={18} />
                      <div>
                        <div className="font-black text-navy">{pharmacy.name || 'Pharmacy'}</div>
                        <div className="text-navy/40">{pharmacy.address || 'Address not available'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="mt-0.5 text-brand-teal" size={18} />
                      <div>
                        <div className="font-black text-navy">Tracking</div>
                        <div className="text-navy/40">
                          {tracking?.deliveryPartner?.name
                            ? `${tracking.deliveryPartner.name} assigned`
                            : currentStatus === 'out for delivery'
                              ? 'Waiting for rider location'
                              : 'Rider not assigned yet'}
                        </div>
                        {tracking?.liveLocation && (
                          <div className="mt-1 text-xs font-bold text-brand-teal">
                            {Number(tracking.liveLocation.lat).toFixed(5)}, {Number(tracking.liveLocation.lng).toFixed(5)}
                          </div>
                        )}
                        {tracking?.eta && (
                          <div className="mt-1 text-xs font-bold text-navy/40">ETA {tracking.eta}</div>
                        )}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                      <div className="h-56">
                        <LiveDeliveryMap
                          className="h-full w-full"
                          driverLocation={driverLocation}
                          pharmacyLocation={pharmacyLocation}
                          deliveryLocation={null}
                        />
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-navy/30">Delivery OTP</div>
                      <div className="mt-1 font-syne text-xl font-black text-navy">{fullOrder?.otp || fullOrder?.deliveryOTP || tracking?.otp || 'Hidden'}</div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
