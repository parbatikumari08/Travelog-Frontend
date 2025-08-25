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
      formData.images.forEach((f) => fd.append("files", f));
      formData.videos.forEach((f) => fd.append("files", f));

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
    <div style={shell.page}>
      <div style={shell.grid}>
        <div style={{ height: "100%", overflow: "hidden auto" }}>
          <div style={shell.card}>
            <h2 style={{ margin: "0 0 12px 0" }}>Add New Entry</h2>

            {newEntryPos && (
              <div style={{ marginBottom: 12 }}>
                <MiniMap location={newEntryPos} height="150px" zoom={7} />
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                style={shell.input}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                style={shell.textarea}
              />

              <div>
                <label style={shell.label}>Images</label>
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
                <label style={shell.label}>Videos</label>
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
                style={{ ...shell.btn, opacity: newEntryPos ? 1 : 0.5 }}
                disabled={!newEntryPos}
              >
                Add Entry
              </button>
            </form>
            {message && <p style={{ marginTop: 8, ...shell.muted }}>{message}</p>}
          </div>
        </div>

        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <p
            style={{
              textAlign: "center",
              padding: "8px",
              fontSize: "14px",
              fontWeight: 500,
              background: "var(--card)",
              borderRadius: "8px",
              marginBottom: "6px",
              color: "var(--text)",
            }}
          >
            🗺️ Zoom and click on the desired location for entry
          </p>
          <div style={{ flex: 1 }}>
            <MapContainer center={[20, 77]} zoom={5} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {newEntryPos && <Marker position={[newEntryPos.lat, newEntryPos.lng]} />}
              <MapClickHandler />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
