// src/components/Timeline.jsx
import React from "react";
import EntryCard from "./EntryCard";

const Timeline = ({ entries, refreshEntries }) => {
  if (!entries || entries.length === 0) {
    return <p className="opacity-70 mt-4">No entries to display.</p>;
  }

  return (
    <div className="timeline space-y-4 overflow-auto max-h-[calc(100vh-100px)]">
      {entries.map((entry) => (
        <EntryCard
          key={entry._id}
          entry={entry}
          refreshEntries={refreshEntries} // so edits/updates refresh timeline
        />
      ))}
    </div>
  );
};

export default Timeline;
