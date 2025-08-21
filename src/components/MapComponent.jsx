// src/components/MapComponent.jsx
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapComponent = ({ location, height = "200px", zoom = 13 }) => {
  if (!location) return <div style={{ height, width: "100%", background: "#f0f0f0", borderRadius: "8px" }}>No location</div>;

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ width: "100%", height, borderRadius: "8px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]} />
    </MapContainer>
  );
};

export default MapComponent;
