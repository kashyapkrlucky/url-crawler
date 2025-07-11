import React, { useState, useMemo } from "react";
import { Play, StopCircle, Eye, Funnel } from "lucide-react";
import PaginationControls from "./PaginationControls";

interface UrlData {
  id: number;
  title: string;
  url: string;
  html_version: string;
  internal_links: number;
  external_links: number;
  broken_links: number;
  h1_count: number;
  status: string;
  updated_at: string;
}

interface ResultsTableProps {
  urls: UrlData[];
  crawlingIds: number[];
  onStartCrawl: (id: number) => void;
  onStopCrawl: (id: number) => void;
  onViewDetails: (id: number) => void;
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const allColumns: { label: string; key: keyof UrlData }[] = [
  { label: "Title", key: "title" },
  { label: "HTML Version", key: "html_version" },
  { label: "Internal Links", key: "internal_links" },
  { label: "External Links", key: "external_links" },
  { label: "Broken Links", key: "broken_links" },
  { label: "H1 Count", key: "h1_count" },
  { label: "Status", key: "status" },
  { label: "Crawl Date", key: "updated_at" },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "failed":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const ResultsTable: React.FC<ResultsTableProps> = ({
  urls,
  crawlingIds,
  onStartCrawl,
  onStopCrawl,
  onViewDetails,
  currentPage,
  pageCount,
  onPageChange,
}) => {
  const [sortKey, setSortKey] = useState<keyof UrlData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState(() =>
    allColumns.map((c) => c.key)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };
  const handleSort = (key: keyof UrlData) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredUrls = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    let filtered = urls.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
    if (sortKey) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortKey]!;
        const bValue = b[sortKey]!;
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [urls, sortKey, sortOrder, searchTerm]);

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-center bg-white rounded-t-md shadow-sm px-3 py-2">
        <PaginationControls
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={onPageChange}
        />

        <div className="w-full flex flex-row gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 rounded outline-none bg-gray-100"
          />

          <div className="flex flex-wrap gap-2 relative">
            <button className="px-2 py-2 cursor-pointer" onClick={toggleFilter}>
              <Funnel
                className={isFilterOpen ? "text-blue-500" : "text-gray-500"}
              />
            </button>
            {isFilterOpen && (
              <div className="absolute top-12 right-0 w-50 p-4 bg-white rounded-md shadow-sm select-none">
                {allColumns.map((col) => (
                  <label key={col.key} className="flex items-center py-1 gap-2">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => {
                        setVisibleColumns((prev) =>
                          prev.includes(col.key)
                            ? prev.filter((k) => k !== col.key)
                            : [...prev, col.key]
                        );
                      }}
                    />
                    <span className="text-sm">{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-b-md shadow-sm">
        <div className="hidden sm:grid grid-cols-10 gap-4 px-4 py-4 bg-blue-100 text-sm font-semibold">
          {allColumns.map(
            ({ label, key }) =>
              visibleColumns.includes(key) && (
                <div
                  key={key}
                  className={`cursor-pointer select-none ${
                    key === "title" ? "col-span-2" : ""
                  }`}
                  onClick={() => handleSort(key)}
                >
                  {label}{" "}
                  {sortKey === key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </div>
              )
          )}
          <div>Actions</div>
        </div>

        {filteredUrls.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No results found.
          </div>
        ) : (
          filteredUrls.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-10 gap-4 px-4 py-4 border-b border-gray-100 mb-4 lg:mb-0 bg-white text-sm hover:bg-gray-50"
            >
              {visibleColumns.includes("title") && (
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="font-medium text-emerald-500">
                    Title: {item.title || "-"}
                  </span>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline break-words"
                  >
                    {item.url || "-"}
                  </a>
                </div>
              )}
              {visibleColumns.includes("html_version") && (
                <div>
                  <span className="sm:hidden font-medium">HTML Version: </span>
                  {item.html_version || "-"}
                </div>
              )}
              {visibleColumns.includes("internal_links") && (
                <div>
                  <span className="sm:hidden font-medium">
                    Internal Links:{" "}
                  </span>
                  {item.internal_links}
                </div>
              )}
              {visibleColumns.includes("external_links") && (
                <div>
                  <span className="sm:hidden font-medium">
                    External Links:{" "}
                  </span>
                  {item.external_links}
                </div>
              )}
              {visibleColumns.includes("broken_links") && (
                <div>
                  <span className="sm:hidden font-medium">Broken Links: </span>
                  {item.broken_links}
                </div>
              )}
              {visibleColumns.includes("h1_count") && (
                <div>
                  <span className="sm:hidden font-medium">H1 Count: </span>
                  {item.h1_count}
                </div>
              )}
              {visibleColumns.includes("status") && (
                <div>
                  <span className="sm:hidden font-medium">Status: </span>
                  <span
                    className={`uppercase font-medium text-xs ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              )}
              {visibleColumns.includes("updated_at") && (
                <div>
                  <span className="sm:hidden font-medium">Crawl Date: </span>
                  {new Date(item.updated_at).toLocaleString()}
                </div>
              )}

              <div className="flex gap-2 items-center flex-wrap">
                {crawlingIds.includes(item.id) ? (
                  <button
                    title="Stop Crawl"
                    onClick={() => onStopCrawl(item.id)}
                    className="flex items-center gap-1 text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                  >
                    <StopCircle size={14} />
                  </button>
                ) : (
                  <button
                    title="Start Crawl"
                    onClick={() => onStartCrawl(item.id)}
                    className="flex items-center gap-1 text-xs text-white bg-emerald-500 px-2 py-1 rounded hover:bg-emerald-600"
                  >
                    <Play size={14} />
                  </button>
                )}

                <button
                  title="View Details"
                  onClick={() => onViewDetails(item.id)}
                  className="flex items-center gap-1 text-xs text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-blue-50"
                >
                  <Eye size={14} />
                </button>
              </div>
            </div>
          ))
        )}

        <div className="py-4">
          <PaginationControls
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
