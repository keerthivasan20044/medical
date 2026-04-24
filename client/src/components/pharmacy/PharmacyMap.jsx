import { useEffect, useRef } from 'react';

export default function PharmacyMap({ pharmacies, center }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 10.9254, lng: 79.8383 },
        zoom: 13,
        styles: MAP_STYLES,
        disableDefaultUI: true,
      });

      pharmacies.forEach(p => {
        if (p.location?.coordinates) {
          const marker = new window.google.maps.Marker({
            position: { lat: p.location.coordinates[1], lng: p.location.coordinates[0] },
            map,
            title: p.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#02C39A",
              fillOpacity: 1,
              strokeWeight: 4,
              strokeColor: "#ffffff",
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; font-family: 'DM Sans', sans-serif;">
                <h4 style="margin: 0; font-weight: 900; text-transform: uppercase; color: #0a1628;">${p.name}</h4>
                <p style="margin: 5px 0 0; font-size: 10px; color: #94a3b8;">${p.address}</p>
                <a href="/pharmacies/${p._id}" style="display: block; margin-top: 10px; font-size: 10px; font-weight: 900; color: #02C39A; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em;">View Node →</a>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [pharmacies, center]);

  return (
    <div className="w-full h-full bg-navy/5 relative overflow-hidden">
       <div ref={mapRef} className="w-full h-full" />
       {!window.google && (
         <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <div className="text-center">
               <div className="h-12 w-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
               <p className="text-[10px] font-black text-navy uppercase tracking-widest italic">Syncing Geo-Nodes...</p>
            </div>
         </div>
       )}
    </div>
  );
}

const MAP_STYLES = [
  { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#0a1628" }, { "opacity": 0.4 }] },
  { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f8fafc" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] }
];
