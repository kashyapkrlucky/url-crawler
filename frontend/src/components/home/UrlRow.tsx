import React from "react";
import { Loader, Play, Square, Eye } from "lucide-react";

export interface UrlEntry {
  id: number;
  url: string;
  status: string;
  title?: string;
}

interface UrlRowProps {
  entry: UrlEntry;
  isCrawling: boolean;
  onStart: (id: number) => void;
  onStop: (id: number) => void;
  onView: (id: number) => void;
}

const UrlRow: React.FC<UrlRowProps> = ({
  entry,
  isCrawling,
  onStart,
  onStop,
  onView,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 p-4 hover:bg-gray-50">
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline truncate max-w-[40%]"
      >
        {entry.url}
      </a>

      <div className="flex items-center gap-3">
        {!isCrawling ? (
          <button
            onClick={() => onStart(entry.id)}
            className="text-green-600 hover:text-green-800"
          >
            <Play size={18} />
          </button>
        ) : (
          <button
            onClick={() => onStop(entry.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Square size={18} />
          </button>
        )}

        {isCrawling ? (
          <Loader className="animate-spin text-gray-500" size={18} />
        ) : (
          <button
            onClick={() => onView(entry.id)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Eye size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default UrlRow;
