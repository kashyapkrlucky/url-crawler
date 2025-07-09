import React from "react";

interface UrlData {
  id: number;
  title: string;
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
  sortKey: keyof UrlData | null;
  sortOrder: "asc" | "desc";
  onSort: (key: keyof UrlData) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  urls,
  sortKey,
  sortOrder,
  onSort,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {[
              { label: "Title", key: "title" },
              { label: "HTML Version", key: "html_version" },
              { label: "Internal Links", key: "internal_links" },
              { label: "External Links", key: "external_links" },
              { label: "Broken Links", key: "broken_links" },
              { label: "H1 Count", key: "h1_count" },
              { label: "Status", key: "status" },
              { label: "Crawl Date", key: "updated_at" },
            ].map(({ label, key }) => (
              <th
                key={key}
                className="border border-gray-300 px-3 py-2 cursor-pointer select-none"
                onClick={() => onSort(key as keyof UrlData)}
              >
                {label}{" "}
                {sortKey === key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {urls.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-4">
                No results found.
              </td>
            </tr>
          ) : (
            urls.map((url) => (
              <tr key={url.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-3 py-1">
                  {url.title || "-"}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {url.html_version || "-"}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {url.internal_links}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {url.external_links}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {url.broken_links}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {url.h1_count}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {url.status}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  {new Date(url.updated_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
