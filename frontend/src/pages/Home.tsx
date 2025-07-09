import React, { useState } from "react";
import Layout from "../components/layout/index";
import UrlForm from "../components/home/UrlForm";
import UrlTable from "../components/home/UrlTable";
import { type UrlEntry } from "../components/home/UrlRow";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [crawlingIds, setCrawlingIds] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleUrlsAdded = (addedUrls: any) => {
    // Assuming addedUrls is an array or a single item, normalize it
    if (Array.isArray(addedUrls)) {
      setUrls((prev) => [...prev, ...addedUrls]);
    } else {
      setUrls((prev) => [...prev, addedUrls]);
    }
  };

  const handleStart = async (id: number) => {
    try {
      setCrawlingIds((prev) => [...prev, id]);
      await axios.post(`/start-crawl/${id}`);
      // Optionally poll or refresh
    } catch (err) {
      console.error("Start crawl error:", err);
      setCrawlingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleStop = async (id: number) => {
    try {
      await axios.post(`/stop-crawl/${id}`);
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
      <div className="max-w-6xl mx-auto flex flex-col">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Submit URLs for Crawling
          </h2>
          <p className="text-gray-700 mb-4">
            This tool helps you analyze websites by crawling the URLs you
            provide. Simply enter one or multiple web addresses below, and the
            app will fetch key details like page title, HTML version, and
            internal links count. Manage your crawls easily and explore detailed
            insights for each URL.
          </p>
        </div>

        <UrlForm onSuccess={handleUrlsAdded} />

        <h3 className="text-lg font-medium mt-8 mb-3 text-gray-700">
          URL List
        </h3>
        <UrlTable
          urls={urls}
          crawlingIds={crawlingIds}
          onStart={handleStart}
          onStop={handleStop}
          onView={handleViewDetails}
        />
      </div>
    </Layout>
  );
};

export default Home;
