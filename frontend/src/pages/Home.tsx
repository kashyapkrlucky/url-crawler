import React from "react";
import Layout from "../components/Layout";

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Welcome to URL Crawler</h2>
        <p className="text-gray-600 leading-relaxed">
          Manage your URLs for analysis, start and stop crawling, and view
          detailed results.
        </p>
      </div>
    </Layout>
  );
};

export default Home;
