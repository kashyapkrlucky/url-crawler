import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../lib/axios";
import Layout from "../components/layout";
import {
  Globe,
  Link as LinkIcon,
  ExternalLink,
  AlertCircle,
  Hash,
  CheckCircle,
  Clock,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BrokenLink {
  url: string;
  statusCode: number;
}

interface UrlDetails {
  id: string;
  url: string;
  title: string;
  htmlVersion: string;
  internalLinksCount: number;
  externalLinksCount: number;
  brokenLinksCount: number;
  h1Count: number;
  status: string;
  updatedAt: string;
  brokenLinks?: BrokenLink[]; // Optional, from API
}

const COLORS = ["#0088FE", "#00C49F"];

const DetailsPage: React.FC = () => {
  const { urlId } = useParams<{ urlId: string }>();
  const [details, setDetails] = useState<UrlDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUrlInfo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`/api/url/${id}`);

      // If API keys are snake_case, map to camelCase here, example:
      const mapped: UrlDetails = {
        id: data.id,
        url: data.url,
        title: data.title,
        htmlVersion: data.html_version,
        internalLinksCount: data.internal_links,
        externalLinksCount: data.external_links,
        brokenLinksCount: data.broken_links,
        h1Count: data.h1_count,
        status: data.status,
        updatedAt: data.updated_at,
        brokenLinks: data.broken_links_list || [], // example key name for broken links
      };

      setDetails(mapped);
    } catch (error) {
      console.error("Failed to fetch URL details:", error);
      setError("Failed to load details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      fetchUrlInfo(urlId);
    }
  }, [urlId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  if (!details)
    return <div className="text-center py-20">Details not found.</div>;

  // Data for PieChart
  const chartData = [
    { name: "Internal Links", value: details.internalLinksCount },
    { name: "External Links", value: details.externalLinksCount },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6">
          {details.title || details.url}
        </h1>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 mb-8">
          <div className="flex items-center gap-2">
            <Globe className="text-gray-600" size={20} />
            <dt className="font-semibold">HTML Version:</dt>
            <dd className="ml-auto font-mono">{details.htmlVersion || "-"}</dd>
          </div>

          <div className="flex items-center gap-2">
            <LinkIcon className="text-green-600" size={20} />
            <dt className="font-semibold">Internal Links:</dt>
            <dd className="ml-auto">{details.internalLinksCount ?? 0}</dd>
          </div>

          <div className="flex items-center gap-2">
            <ExternalLink className="text-blue-600" size={20} />
            <dt className="font-semibold">External Links:</dt>
            <dd className="ml-auto">{details.externalLinksCount ?? 0}</dd>
          </div>

          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <dt className="font-semibold">Broken Links:</dt>
            <dd className="ml-auto">{details.brokenLinksCount ?? 0}</dd>
          </div>

          <div className="flex items-center gap-2">
            <Hash className="text-purple-600" size={20} />
            <dt className="font-semibold">H1 Count:</dt>
            <dd className="ml-auto">{details.h1Count ?? 0}</dd>
          </div>

          <div className="flex items-center gap-2">
            {details.status === "completed" ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <dt className="font-semibold">Status:</dt>
            <dd className="ml-auto uppercase font-semibold">
              {details.status || "N/A"}
            </dd>
          </div>

          <div className="flex items-center gap-2 col-span-full">
            <Clock className="text-gray-600" size={20} />
            <dt className="font-semibold">Last Updated:</dt>
            <dd className="ml-auto font-mono">
              {details.updatedAt
                ? new Date(details.updatedAt).toLocaleString()
                : "-"}
            </dd>
          </div>
        </dl>

        {/* Donut chart for internal vs external links */}
        <div className="w-full h-64 mb-8">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Broken links list */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Broken Links</h2>
          {details.brokenLinks && details.brokenLinks.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-sm text-red-700 max-h-48 overflow-auto">
              {details.brokenLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {link.url}
                  </a>{" "}
                  — Status Code: {link.statusCode}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No broken links found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DetailsPage;
