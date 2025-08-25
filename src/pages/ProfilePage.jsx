// frontend/src/pages/ProfilePage.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import EntryCard from "../components/EntryCard";
import MiniMap from "../components/MiniMap";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeEntries, setActiveEntries] = useState([]);
  const [archivedEntries, setArchivedEntries] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [tab, setTab] = useState("active");
  const [loading, setLoading] = useState(true);

  const [viewEntry, setViewEntry] = useState(null);   // For read-only view
  const [editEntry, setEditEntry] = useState(null);   // For full editor
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [editorMsg, setEditorMsg] = useState("");

  const API_BASE = useMemo(() => {
    const b = api.defaults?.baseURL || "";
    return b.endsWith("/") ? b.slice(0, -1) : b;
  }, []);

  const fileUrl = (p = "") => (!p ? "" : p.startsWith("http") ? p : `${API_BASE}${p.startsWith("/") ? p : `/${p}`}`);

  // ---------- Load user & entries ----------
  const loadMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      setProfilePic(res.data.profilePic || "");
    } catch (err) { console.error(err); }
  };

  const loadEntries = async () => {
    try {
      const [activeRes, archivedRes] = await Promise.all([
        api.get("/entries/user"),
        api.get("/entries/archive"),
      ]);
      setActiveEntries(activeRes.data || []);
      setArchivedEntries(archivedRes.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    (async () => {
      try {
        await loadMe();
        await loadEntries();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshEntries = async () => { await loadEntries(); };

  // ---------- Profile picture ----------
  const handleProfilePicChange = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("avatar", file);
    try {
      const res = await api.post("/user/avatar", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.profilePic) {
        setProfilePic(res.data.profilePic);
        setUser(prev => prev ? { ...prev, profilePic: res.data.profilePic } : prev);
      } else alert("Failed to update profile picture");
    } catch (err) { console.error(err); alert("Failed to update profile picture"); }
  };

  // ---------- Entry actions ----------
  const archiveEntry = async (id) => { try { await api.delete(`/entries/${id}`); await refreshEntries(); } catch (err) { console.error(err); } };
  const restoreEntry = async (id) => { try { await api.put(`/entries/archive/${id}/restore`); await refreshEntries(); } catch (err) { console.error(err); } };
  const deleteEntry = async (id) => { if (!window.confirm("Delete permanently?")) return; try { await api.delete(`/entries/archive/${id}`); await refreshEntries(); } catch (err) { console.error(err); alert("Failed to delete"); } };

  const openEditor = (entry) => { setEditEntry(entry); setNewMediaFiles([]); setEditorMsg(""); };
  const closeEditor = () => { setEditEntry(null); setNewMediaFiles([]); setEditorMsg(""); };
  const openView = (entry) => { setViewEntry(entry); };
  const closeView = () => { setViewEntry(null); };

  const uploadMoreMedia = async () => {
  if (!editEntry || !newMediaFiles.length) return;
  setEditorMsg("Uploading...");
  try {
    const fd = new FormData();
    newMediaFiles.forEach(f => fd.append("media", f)); // ✅ use "media" not "files"

    const res = await api.post(`/entries/${editEntry._id}/media`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 200 && Array.isArray(res.data)) {
      // ✅ merge new media with old
      setEditEntry(prev => ({
        ...prev,
        media: [...(prev.media || []), ...res.data],
      }));

      await refreshEntries(); // reload entry cards
      setNewMediaFiles([]);
      setEditorMsg("Uploaded successfully.");
    } else {
      setEditorMsg("Upload failed.");
    }
  } catch (err) {
    console.error(err);
    setEditorMsg("Upload failed.");
  }
};


  if (loading) return <div className="profile__loading">Loading...</div>;

  return (
    <div className="profile">
      {/* Header */}
      <div className="profile__header">
        <div className="profile__identity">
          <div className="profile__avatar">{profilePic ? <img src={fileUrl(profilePic)} alt="Profile"/> : <div className="profile__avatar-fallback">{user?.name?.[0]?.toUpperCase() || "U"}</div>}</div>
          <div className="profile__details">
            <h1 className="profile__name">{user?.name || "Your Profile"}</h1>
            <p className="profile__email">{user?.email}</p>
            <label className="profile__upload">
              <input type="file" accept="image/*" onChange={handleProfilePicChange}/>
              <span>Change photo</span>
            </label>
          </div>
        </div>
        <div className="profile__stats">
          <div className="stat"><div className="stat__num">{activeEntries.length}</div><div className="stat__label">Active</div></div>
          <div className="stat"><div className="stat__num">{archivedEntries.length}</div><div className="stat__label">Archived</div></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile__tabs">
        <button className={`tab ${tab==="active"?"is-active":""}`} onClick={()=>setTab("active")}>Your Entries</button>
        <button className={`tab ${tab==="archived"?"is-active":""}`} onClick={()=>setTab("archived")}>Archived</button>
      </div>

      {/* Entries */}
      <div className="entry-grid">
        {(tab==="active" ? activeEntries : archivedEntries).map(e => (
          <EntryCard
            key={e._id}
            entry={e}
            onView={openView}
            onEdit={openEditor}
            onArchive={archiveEntry}
            onRestore={restoreEntry}
            onDelete={deleteEntry}
          />
        ))}
      </div>

      {/* Read-only view modal */}
{viewEntry && (
  <div className="modal" role="dialog">
    <div className="modal__backdrop" onClick={closeView} />
    <div className="modal__panel">
      <div className="modal__header">
        <div>
          <div className="modal__title">{viewEntry.title}</div>
          <div className="modal__subtitle">{viewEntry.description}</div>
        </div>
        <button className="modal__close" onClick={closeView}>×</button>
      </div>

      {/* ✅ MiniMap in View modal */}
      {viewEntry.location && (
        <div style={{ margin: "12px 0" }}>
          <MiniMap
            location={
              viewEntry.location.lat && viewEntry.location.lng
                ? viewEntry.location
                : {
                    lat: viewEntry.location.coordinates?.[1],
                    lng: viewEntry.location.coordinates?.[0],
                  }
            }
            height="200px"
            zoom={9}
          />
        </div>
      )}

      {/* Media */}
{viewEntry.media?.length > 0 && (
  <div className="view-media-container">
    {viewEntry.media.map((m, idx) => {
      const src = fileUrl(m.url);
      if (/\.(png|jpe?g|gif|webp|avif)$/i.test(src)) {
        return <img key={idx} className="view-media" src={src} alt="" />;
      }
      if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(src)) {
        return <video key={idx} className="view-media" src={src} controls />;
      }
      return null;
    })}
  </div>
)}


      <button onClick={closeView}>Close</button>
    </div>
  </div>
)}


      {/* Full editor modal */}
      {editEntry && (
        <div className="modal" role="dialog">
          <div className="modal__backdrop" onClick={closeEditor} />
          <div className="modal__panel">
            
            {/* Editable Map */}
            {editEntry.location && (
              <div className="modal__map">
                <MiniMap
                  location={editEntry.location}
                  height="300px"
                  zoom={10}
                  editable={true}
                  onLocationChange={(loc) =>
                    setEditEntry(prev => ({ ...prev, location: loc }))
                  }
                />
              </div>
            )}

            {/* Editable Title & Description */}
            <div className="modal__header">
              <input
                type="text"
                value={editEntry.title}
                onChange={(e) => setEditEntry(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
              />
              <textarea
                value={editEntry.description}
                onChange={(e) => setEditEntry(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
              />
              <button className="modal__close" onClick={closeEditor}>×</button>
            </div>

            {/* Current Media with delete option */}
            {editEntry.media?.length > 0 && (
              <>
                <div className="section-title">Current media</div>
                <div className="media-grid media-grid--tight">
                  {editEntry.media.map((m, idx) => (
                    <div key={idx} className="media-grid__item-wrapper">
                      {/\.(png|jpe?g|gif|webp|avif)$/i.test(m.url) ? (
                        <img className="media-grid__item" src={fileUrl(m.url)} alt="" />
                      ) : (
                        <video className="media-grid__item" src={fileUrl(m.url)} controls />
                      )}
                      <button
                        className="btn btn--danger btn--small media-delete-btn"
                        onClick={async () => {
                          await api.delete(`/entries/${editEntry._id}/media/${m._id}`);
                          await refreshEntries();
                          setEditEntry(prev => ({
                            ...prev,
                            media: prev.media.filter(x => x._id !== m._id)
                          }));
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Add More Media */}
            <div className="section-title">Add more media</div>
            <input type="file" multiple accept="image/*,video/*" onChange={e => setNewMediaFiles(Array.from(e.target.files || []))}/>
            
            {/* Save / Upload Actions */}
            <div className="modal__actions">
              <button className="btn" onClick={uploadMoreMedia} disabled={!newMediaFiles.length}>Upload</button>
              <button className="btn btn--primary"
                onClick={async () => {
                  await api.put(`/entries/${editEntry._id}`, {
                    title: editEntry.title,
                    description: editEntry.description,
                    location: editEntry.location
                  });
                  await refreshEntries();
                  closeEditor();
                }}
              >
                Save Changes
              </button>
              <button className="btn btn--ghost" onClick={closeEditor}>Close</button>
            </div>

            {editorMsg && <div className="modal__msg">{editorMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
