import React, { useEffect, useState } from "react";
import Layout from "../components/layout/index";
import UrlForm from "../components/home/UrlForm";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";
import ResultsTable from "../components/home/ResultsTable";

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

const PAGE_SIZE = 20;

const Home: React.FC = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [crawlingIds, setCrawlingIds] = useState<number[]>([]);

  const navigate = useNavigate();

  const fetchUrls = async (page: number, limit: number) => {
    try {
      const { data } = await axios.get(`/api/urls?page=${page}&limit=${limit}`);
      setUrls(data.urls);
      setTotalCount(data.total);
    } catch (err) {
      console.error("Failed to fetch URLs", err);
    }
  };

  useEffect(() => {
    fetchUrls(currentPage, PAGE_SIZE);
  }, [currentPage]);

  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  const handleStart = async (id: number) => {
    try {
      setCrawlingIds((prev) => [...prev, id]);
      await axios.post(`/api/start-crawl/${id}`);
    } catch (err) {
      console.error("Start crawl error:", err);
    } finally {
      setCrawlingIds((prev) => prev.filter((x) => x !== id));
      fetchUrls(currentPage, PAGE_SIZE);
    }
  };

  const handleStop = async (id: number) => {
    try {
      await axios.post(`/api/stop-crawl/${id}`);
      setCrawlingIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error("Stop crawl error:", err);
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/details/${id}`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto flex flex-col flex-1">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-gray-900 mb-2">
            Submit URLs for Crawling
          </h2>
          <p className="text-gray-700 text-sm mb-4">
            This tool helps you analyze websites by crawling the URLs you
            provide. Simply enter one or multiple web addresses below, and the
            app will fetch key details like page title, HTML version, and
            internal links count. Manage your crawls easily and explore detailed
            insights for each URL.
          </p>
        </div>

        <UrlForm onSuccess={() => fetchUrls(currentPage, PAGE_SIZE)} />
        <h2 className="text-xl mb-4">Crawling History</h2>

        <div className="flex flex-col gap-4 flex-1">
          {urls.length > 0 && (
            <ResultsTable
              urls={urls}
              crawlingIds={crawlingIds}
              onStartCrawl={handleStart}
              onStopCrawl={handleStop}
              onViewDetails={handleViewDetails}
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
