import React from "react";
import Layout from "../components/layout";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <Layout>
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p>
        Oops! The page you are looking for does not exist. Go back{" "}
        <Link to="/" className="text-blue-600 underline">
          home
        </Link>
        .
      </p>
    </div>
  </Layout>
);

export default NotFound;
