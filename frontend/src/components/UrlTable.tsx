import React from "react";
import UrlRow, { type UrlEntry } from "./UrlRow";

interface UrlTableProps {
  urls: UrlEntry[];
  crawlingIds: number[];
  onStart: (id: number) => void;
  onStop: (id: number) => void;
  onView: (id: number) => void;
}

const UrlTable: React.FC<UrlTableProps> = ({
  urls,
  crawlingIds,
  onStart,
  onStop,
  onView,
}) => {
  return (
    <div className="bg-white border rounded shadow w-full max-w-3xl mx-auto">
      {urls.length === 0 ? (
        <div className="p-4 text-gray-500 text-sm">No URLs added yet.</div>
      ) : (
        urls?.map((entry) => (
          <UrlRow
            key={entry.id}
            entry={entry}
            isCrawling={crawlingIds.includes(entry.id)}
            onStart={onStart}
            onStop={onStop}
            onView={onView}
          />
        ))
      )}
    </div>
  );
};

export default UrlTable;
