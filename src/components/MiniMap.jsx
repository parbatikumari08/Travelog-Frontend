import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    const fix = () => {
      map.invalidateSize({ animate: false });
    };

    // Fix after mount
    setTimeout(fix, 350);

    // Fix when user scrolls or window resizes
    window.addEventListener("scroll", fix);
    window.addEventListener("resize", fix);

    return () => {
      window.removeEventListener("scroll", fix);
      window.removeEventListener("resize", fix);
    };
  }, [map]);

  return null;
}

export default function MiniMap({ location, height = "150px", zoom = 7 }) {
  if (!location) return null;

  const finalLocation = location.lat
    ? location
    : {
        lat: location.coordinates?.[1],
        lng: location.coordinates?.[0],
      };

  if (!finalLocation?.lat || !finalLocation?.lng) return null;

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "0.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <MapContainer
        center={[finalLocation.lat, finalLocation.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[finalLocation.lat, finalLocation.lng]} />
        <ResizeMap />
      </MapContainer>
    </div>
  );
}
