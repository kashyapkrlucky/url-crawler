import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import SearchBox from "../components/results/SearchBox";
import FiltersBar from "../components/results/FiltersBar";
import ResultsTable from "../components/results/ResultsTable";
import PaginationControls from "../components/results/PaginationControls";
import Layout from "../components/layout";

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

const PAGE_SIZE = 10;

const ResultsPage: React.FC = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortKey, setSortKey] = useState<keyof UrlData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get("http://localhost:8080/api/urls?page=1&limit=100").then((res) => {
      setUrls(res.data.urls);
    });
  }, []);

  // Basic search: case-insensitive substring search on title, html_version, and status
  const searchedUrls = useMemo(() => {
    if (!searchTerm.trim()) return urls;

    const lowerTerm = searchTerm.toLowerCase();

    return urls.filter(
      (url) =>
        url.title?.toLowerCase().includes(lowerTerm) ||
        url.html_version?.toLowerCase().includes(lowerTerm) ||
        url.status?.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm, urls]);

  const filteredUrls = useMemo(() => {
    return searchedUrls.filter((url) =>
      Object.entries(filters).every(([key, val]) => {
        if (!val) return true;
        const field = url[key as keyof UrlData];
        return field?.toString().toLowerCase().includes(val.toLowerCase());
      })
    );
  }, [searchedUrls, filters]);

  const sortedUrls = useMemo(() => {
    if (!sortKey) return filteredUrls;
    return [...filteredUrls].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
  }, [filteredUrls, sortKey, sortOrder]);

  const pageCount = Math.ceil(sortedUrls.length / PAGE_SIZE);
  const paginatedUrls = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedUrls.slice(start, start + PAGE_SIZE);
  }, [sortedUrls, currentPage]);

  // Handlers
  const handleSort = (key: keyof UrlData) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Crawl Results</h1>
        <div className="flex flex-col lg:flex-row gap-4 h-16 bg-white shadow-sm rounded-sm p-2">
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <FiltersBar filters={filters} onFilterChange={handleFilterChange} />
          <PaginationControls
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={setCurrentPage}
          />
        </div>
        <ResultsTable
          urls={paginatedUrls}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>
    </Layout>
  );
};

export default ResultsPage;
