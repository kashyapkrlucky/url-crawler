import React from "react";

interface FiltersBarProps {
  filters: { [key: string]: string };
  onFilterChange: (key: string, value: string) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Filter by Status"
        className="border border-gray-300 rounded px-2 py-1"
        value={filters.status || ""}
        onChange={(e) => onFilterChange("status", e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by HTML Version"
        className="border border-gray-300 rounded px-2 py-1"
        value={filters.html_version || ""}
        onChange={(e) => onFilterChange("html_version", e.target.value)}
      />
      {/* Add more filters if needed */}
    </div>
  );
};

export default FiltersBar;
