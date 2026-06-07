import { useEffect, useMemo, useRef, useState } from 'react';
import { Home, MapPin, Navigation, Pill, Truck } from 'lucide-react';
import { loadGoogleMaps } from '../../services/mapLoader';

const DEFAULT_CENTER = { lat: 10.9252, lng: 79.8383 };

const MAP_STYLES = [
  { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#0a1628' }, { opacity: 0.65 }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#eef7f6' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d9eeee' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#9ed5dd' }] }
];

function markerIcon(color, label) {
  if (!window.google?.maps) return undefined;
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 10,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 4,
    labelOrigin: new window.google.maps.Point(0, -2)
  };
}

function fallbackPoint(location, index) {
  if (Number.isFinite(location?.lat) && Number.isFinite(location?.lng)) return location;
  const offsets = [
    { lat: 0, lng: 0 },
    { lat: 0.008, lng: 0.01 },
    { lat: -0.008, lng: -0.012 }
  ];
  return {
    lat: DEFAULT_CENTER.lat + offsets[index].lat,
    lng: DEFAULT_CENTER.lng + offsets[index].lng
  };
}

function getBounds(points) {
  const values = Object.values(points);
  const lats = values.map((point) => point.lat);
  const lngs = values.map((point) => point.lng);
  const padding = 0.01;
  return {
    minLat: Math.min(...lats) - padding,
    maxLat: Math.max(...lats) + padding,
    minLng: Math.min(...lngs) - padding,
    maxLng: Math.max(...lngs) + padding
  };
}

function getMarkerPosition(point, bounds) {
  const lngRange = bounds.maxLng - bounds.minLng || 1;
  const latRange = bounds.maxLat - bounds.minLat || 1;
  return {
    left: `${((point.lng - bounds.minLng) / lngRange) * 100}%`,
    top: `${(1 - (point.lat - bounds.minLat) / latRange) * 100}%`
  };
}

export default function LiveDeliveryMap({ driverLocation, pharmacyLocation, deliveryLocation, className = '' }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const routeRef = useRef(null);
  const [mapsReady, setMapsReady] = useState(false);

  const points = useMemo(() => ({
    driver: fallbackPoint(driverLocation, 0),
    pharmacy: fallbackPoint(pharmacyLocation, 1),
    delivery: fallbackPoint(deliveryLocation, 2)
  }), [driverLocation, pharmacyLocation, deliveryLocation]);

  useEffect(() => {
    let mounted = true;
    loadGoogleMaps()
      .then((maps) => {
        if (!mounted || !maps || !mapEl.current) return;
        mapRef.current = new maps.Map(mapEl.current, {
          center: points.driver,
          zoom: 14,
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true
        });
        setMapsReady(true);
      })
      .catch(() => setMapsReady(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapsReady || !window.google?.maps || !mapRef.current) return;
    const maps = window.google.maps;
    const map = mapRef.current;

    const markerConfig = [
      { key: 'pharmacy', position: points.pharmacy, color: '#028090', title: 'Pharmacy', label: 'P' },
      { key: 'delivery', position: points.delivery, color: '#0a1628', title: 'Delivery Address', label: 'H' },
      { key: 'driver', position: points.driver, color: '#02c39a', title: 'Delivery Partner', label: 'D' }
    ];

    markerConfig.forEach((item) => {
      if (!markersRef.current[item.key]) {
        markersRef.current[item.key] = new maps.Marker({
          map,
          title: item.title,
          icon: markerIcon(item.color, item.label),
          label: { text: item.label, color: '#ffffff', fontSize: '11px', fontWeight: '900' }
        });
      }
      markersRef.current[item.key].setPosition(item.position);
    });

    if (!routeRef.current) {
      routeRef.current = new maps.Polyline({
        map,
        strokeColor: '#028090',
        strokeOpacity: 0.85,
        strokeWeight: 4,
        geodesic: true
      });
    }
    routeRef.current.setPath([points.pharmacy, points.driver, points.delivery]);

    const bounds = new maps.LatLngBounds();
    [points.pharmacy, points.driver, points.delivery].forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 72);
  }, [mapsReady, points]);

  if (!mapsReady) {
    const bounds = getBounds(points);
    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}&layer=mapnik&marker=${points.driver.lat},${points.driver.lng}`;
    const fallbackMarkers = [
      { key: 'pharmacy', point: points.pharmacy, icon: Pill, label: 'Pharmacy', tone: 'border-teal-600 text-teal-700' },
      { key: 'delivery', point: points.delivery, icon: Home, label: 'Address', tone: 'border-slate-900 text-slate-900' },
      { key: 'driver', point: points.driver, icon: Truck, label: 'Live GPS', tone: 'border-emerald-500 text-emerald-600 bg-white' }
    ];

    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <iframe
          title="OpenStreetMap live delivery map"
          src={osmUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/20 via-transparent to-white/20" />
        {fallbackMarkers.map((item) => {
          const Icon = item.icon;
          const position = getMarkerPosition(item.point, bounds);
          return (
            <div
              key={item.key}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={position}
            >
              <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border-2 bg-white shadow-xl ${item.tone}`}>
                <Icon size={20} />
              </div>
              <div className="mt-1 rounded-lg bg-white/95 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-navy shadow">
                {item.label}
              </div>
            </div>
          );
        })}
        <div className="absolute left-5 right-5 top-5 rounded-2xl bg-white/95 p-4 text-navy shadow-lg backdrop-blur md:left-6 md:right-auto md:w-[28rem]">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-700"><Navigation size={14} /> Free OpenStreetMap GPS</div>
          <p className="mt-1 text-xs font-semibold text-navy/55">No map API key is required. Add VITE_GOOGLE_MAPS_API_KEY only if you want Google Maps.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={mapEl} className="h-full w-full" />
      <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Live GPS Tracking
        </div>
      </div>
      <div className="absolute bottom-5 right-5 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2 text-xs font-black text-navy">
          <MapPin size={15} className="text-teal-600" />
          {points.driver.lat.toFixed(5)}, {points.driver.lng.toFixed(5)}
        </div>
      </div>
    </div>
  );
}
