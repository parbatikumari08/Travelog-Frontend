// src/components/EntryCard.jsx
import React from "react";
import MiniMap from "./MiniMap";

export default function EntryCard({
  entry,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}) {
  const isImage = (url = "") => /\.(png|jpe?g|gif|webp|avif)$/i.test(url);
  const isVideo = (url = "") => /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);

  const fileUrl = (url) =>
    url.startsWith("http") ? url : `http://localhost:5000${url}`;

  // ✅ Normalize location (lat/lng OR GeoJSON { type: "Point", coordinates })
  let normalizedLocation = null;
  if (entry.location) {
    if (entry.location.lat && entry.location.lng) {
      normalizedLocation = {
        lat: entry.location.lat,
        lng: entry.location.lng,
      };
    } else if (
      entry.location.type === "Point" &&
      Array.isArray(entry.location.coordinates)
    ) {
      normalizedLocation = {
        lat: entry.location.coordinates[1],
        lng: entry.location.coordinates[0],
      };
    }
  }

  return (
    <div className="entry-card">
      {/* Header */}
      <div className="entry-card__header">
        <h3 className="entry-card__title">{entry.title}</h3>
        <p className="entry-card__desc">{entry.description}</p>
      </div>

      {/* ✅ Mini Map (static preview) */}
      {normalizedLocation && (
        <div className="entry-card__map">
          <MiniMap location={normalizedLocation} height="140px" zoom={7} />
        </div>
      )}

      {/* Media Section */}
      {entry.media?.length > 0 && (
        <div className="media-grid">
          {entry.media.map((m, idx) => {
            const src = fileUrl(m.url);
            if (isImage(src)) {
              return (
                <img key={idx} className="media-grid__item" src={src} alt="" />
              );
            }
            if (isVideo(src)) {
              return (
                <video
                  key={idx}
                  className="media-grid__item"
                  src={src}
                  controls
                />
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Actions */}
      <div className="entry-card__actions">
        <button className="btn btn--ghost" onClick={() => onView(entry)}>
          View
        </button>

        {entry.archived ? (
          <>
            <button className="btn" onClick={() => onRestore(entry._id)}>
              Restore
            </button>
            <button className="btn btn--danger" onClick={() => onDelete(entry._id)}>
              Delete Forever
            </button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => onEdit(entry)}>
              Edit
            </button>
            <button className="btn" onClick={() => onArchive(entry._id)}>
              Archive
            </button>
          </>
        )}
      </div>
    </div>
  );
}