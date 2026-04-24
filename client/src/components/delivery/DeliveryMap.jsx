import { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function DeliveryMap({ tasks, activeTask, partnerLocation }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // If window.google is available, initialize map
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: partnerLocation || { lat: 10.9254, lng: 79.8383 }, // Karaikal default
        zoom: 14,
        styles: MAP_STYLES,
        disableDefaultUI: true,
      });

      // Add markers for available tasks
      tasks?.forEach(task => {
        if (task.pharmacyId?.location?.coordinates) {
          new window.google.maps.Marker({
            position: { 
              lat: task.pharmacyId.location.coordinates[1], 
              lng: task.pharmacyId.location.coordinates[0] 
            },
            map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#02C39A",
              fillOpacity: 1,
              strokeWeight: 4,
              strokeColor: "#ffffff",
            },
            title: task.pharmacyId.name
          });
        }
      });
    }
  }, [tasks, activeTask, partnerLocation]);

  return (
    <div className="w-full h-full bg-navy/5 relative overflow-hidden flex items-center justify-center">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Overlay info if loading or error */}
      {!window.google && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-navy/10 backdrop-blur-sm">
           <Navigation size={48} className="text-navy/20 animate-pulse mb-4" />
           <h3 className="font-syne font-black text-xl text-navy uppercase italic">Geo-Mesh Offline</h3>
           <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-2 max-w-xs">Initializing localized distribution matrix...</p>
        </div>
      )}

      {/* Floating Status */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
         <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white shadow-lg flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-[10px] font-black text-navy uppercase tracking-widest">Live Sector Scan</span>
         </div>
      </div>
    </div>
  );
}

const MAP_STYLES = [
  { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#0a1628" }, { "opacity": 0.4 }] },
  { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#0a1628" }] },
  { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f0f2f5" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#e5e7eb" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#8da8b8" }, { "opacity": 0.2 }] }
];
