import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";
import MiniMap from "../components/MiniMap";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import "./DashboardPage.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icon for selected location
const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function DashboardPage() {
  const [newEntryPos, setNewEntryPos] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    videos: [],
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [recentEntries, setRecentEntries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Fetch recent entries on load
  useEffect(() => {
    fetchRecentEntries();
  }, []);

  const fetchRecentEntries = async () => {
    try {
      const res = await api.get("/entries/recent");
      setRecentEntries(res.data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch recent entries:", err);
    }
  };

  const handleMapClick = (latlng) => {
    setNewEntryPos({ lat: latlng.lat, lng: latlng.lng });
    setMessage({ 
      type: "success", 
      text: "📍 Location selected! Fill in the details below." 
    });
    
    // Auto-hide message after 3 seconds
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData((s) => ({ ...s, images: Array.from(files) }));
    } else if (name === "videos") {
      setFormData((s) => ({ ...s, videos: Array.from(files) }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntryPos) {
      setMessage({ type: "error", text: "Please click on the map to select a location first." });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "info", text: "Adding your memory..." });

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("location", JSON.stringify(newEntryPos));
      
      formData.images.forEach((f) => fd.append("media", f));
      formData.videos.forEach((f) => fd.append("media", f));

      await api.post("/entries", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setFormData({ title: "", description: "", images: [], videos: [] });
      setNewEntryPos(null);
      
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";

      setMessage({ 
        type: "success", 
        text: "✨ Entry added successfully! Click on the map to add another." 
      });
      
      // Refresh recent entries
      fetchRecentEntries();

      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Failed to add entry. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearLocation = () => {
    setNewEntryPos(null);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <motion.h1 
          className="dashboard-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Travel Dashboard
        </motion.h1>
        <motion.p 
          className="dashboard-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Document your journey, one location at a time
        </motion.p>
      </div>

      <div className="dashboard-grid">
        {/* Map Section - First in mobile view */}
        {/* Map Section - With Full Controls */}
<motion.div 
  className="map-section"
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  <div className="map-header">
    <span className="map-instruction">🗺️ Click anywhere on the map to add a memory</span>
  </div>
  <div className="map-container">
    <MapContainer
      center={[20, 77]}
      zoom={5}
      className="leaflet-map"
      zoomControl={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
      touchZoom={true}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {newEntryPos && (
        <Marker 
          position={[newEntryPos.lat, newEntryPos.lng]} 
          icon={selectedIcon}
        />
      )}
      <MapClickHandler onMapClick={handleMapClick} />
    </MapContainer>
  </div>
  
  {/* Quick Tips - Updated */}
  <div className="map-tips">
    <span className="tip">🔍 Scroll to zoom</span>
    <span className="tip">👆 Click to drop pin</span>
  </div>
</motion.div>
        {/* Form Section - Second in mobile view */}
        <motion.div 
          className="form-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="form-card">
            <h2 className="section-title">Add New Memory</h2>
            
            {/* Location Preview */}
            <AnimatePresence>
              {newEntryPos && (
                <motion.div 
                  className="location-preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="preview-header">
                    <span className="preview-title">Selected Location</span>
                    <button onClick={clearLocation} className="clear-btn">✕</button>
                  </div>
                  <MiniMap location={newEntryPos} height="150px" zoom={10} />
                  <div className="coordinates">
                    <span>Lat: {newEntryPos.lat.toFixed(4)}</span>
                    <span>Lng: {newEntryPos.lng.toFixed(4)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="entry-form">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="E.g., Sunset at the beach"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  placeholder="Share your experience..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Images</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    ref={imageInputRef}
                    className="file-input"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="file-label">
                    📸 Choose Images
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <span className="file-count">{formData.images.length} image(s) selected</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Videos</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    name="videos"
                    accept="video/*"
                    multiple
                    onChange={handleChange}
                    ref={videoInputRef}
                    className="file-input"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="file-label">
                    🎥 Choose Videos
                  </label>
                </div>
                {formData.videos.length > 0 && (
                  <span className="file-count">{formData.videos.length} video(s) selected</span>
                )}
              </div>

              <button
                type="submit"
                disabled={!newEntryPos || isSubmitting}
                className={`submit-btn ${!newEntryPos ? 'disabled' : ''}`}
              >
                {isSubmitting ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    <span>Add Memory</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Message Toast */}
            <AnimatePresence>
              {message.text && (
                <motion.div 
                  className={`message-toast ${message.type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Entries Preview */}
          {recentEntries.length > 0 && (
            <motion.div 
              className="recent-entries"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="recent-title">Recent Memories</h3>
              <div className="entries-list">
                {recentEntries.map((entry, idx) => (
                  <div key={idx} className="entry-preview">
                    <div className="entry-icon">📍</div>
                    <div className="entry-details">
                      <h4>{entry.title}</h4>
                      <p>{entry.description.substring(0, 50)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}