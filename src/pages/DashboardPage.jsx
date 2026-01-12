import { useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";
import MapComponent from "../components/MapComponent";
import MiniMap from "../components/MiniMap";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function DashboardPage() {
  const [newEntryPos, setNewEntryPos] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    videos: [],
  });
  const [message, setMessage] = useState("");

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const shell = useMemo(
    () => ({
      page: {
        maxWidth: 1120,
        margin: "0 auto",
        padding: 16,
        height: "calc(100vh - 64px)",
        background: "var(--bg)",
        color: "var(--text)",
      },
      grid: {
        display: "grid",
        gridTemplateColumns: "380px 1fr",
        gap: 16,
        height: "100%",
      },
      card: {
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: 16,
        background: "var(--card)",
        color: "var(--text)",
        boxShadow: "var(--shadow)",
      },
      btn: {
        padding: "10px 12px",
        borderRadius: 10,
        border: "none",
        background: "var(--brand)",
        color: "#fff",
        cursor: "pointer",
      },
      input: {
        width: "100%",
        border: "1px solid var(--line)",
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 14,
        background: "var(--card)",
        color: "var(--text)",
      },
      textarea: {
        width: "100%",
        border: "1px solid var(--line)",
        borderRadius: 8,
        padding: "10px 12px",
        minHeight: 90,
        fontSize: 14,
        background: "var(--card)",
        color: "var(--text)",
      },
      label: {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 6,
        color: "var(--text)",
      },
      muted: { fontSize: 13, opacity: 0.8, color: "var(--muted)" },
    }),
    []
  );

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setNewEntryPos({ lat, lng });
        setMessage("Location selected. Fill the form to add your entry.");
      },
    });
    return null;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") setFormData((s) => ({ ...s, images: Array.from(files) }));
    else if (name === "videos") setFormData((s) => ({ ...s, videos: Array.from(files) }));
    else setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntryPos) {
      setMessage("Please click on the map to select a location first.");
      return;
    }

    setMessage("Adding entry...");
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

      setFormData({ title: "", description: "", images: [], videos: [] });
      setNewEntryPos(null);

      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";

      setMessage("✅ Entry added in your Profile! Click on the map to add another.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add entry. Try again.");
    }
  };

return (
  <div className="max-w-6xl mx-auto p-4 h-auto min-h-[100vh]">
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 h-auto">

      {/* LEFT: Form */}
      <div className="h-full overflow-y-auto">
        <div className="border rounded-xl p-4 shadow-sm bg-white">

          <h2 className="text-xl font-semibold mb-3">Add New Entry</h2>

          {newEntryPos && (
            <div className="mb-3">
              <MiniMap location={newEntryPos} height="150px" zoom={7} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 min-h-[90px]"
            />

            <div>
              <label className="font-medium mb-1 block">Images</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                ref={imageInputRef}
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Videos</label>
              <input
                type="file"
                name="videos"
                accept="video/*"
                multiple
                onChange={handleChange}
                ref={videoInputRef}
              />
            </div>

            <button
              type="submit"
              disabled={!newEntryPos}
              className={`w-full py-2 rounded-lg text-white 
                ${newEntryPos ? "bg-blue-600" : "bg-blue-400 cursor-not-allowed"}`}
            >
              Add Entry
            </button>
          </form>

          {message && (
            <p className="text-gray-600 text-sm mt-2">{message}</p>
          )}
        </div>
      </div>

      {/* RIGHT: Map */}
      <div className="flex flex-col h-full">
        <p className="text-center p-2 text-sm font-medium bg-gray-100 rounded-lg mb-2">
          🗺️ Zoom and click on a location to add entry
        </p>

        <div className="flex-1">
          <MapContainer
            center={[20, 77]}
            zoom={5}
            className="h-[400px] lg:h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {newEntryPos && <Marker position={[newEntryPos.lat, newEntryPos.lng]} />}
            <MapClickHandler />
          </MapContainer>
        </div>
      </div>

    </div>
  </div>
);

