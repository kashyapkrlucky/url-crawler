import React from "react";
import { NavLink } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-dvh bg-gray-50 text-gray-800 flex flex-col gap-4">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-row gap-6 items-center">
          <h1 className="text-xl font-semibold text-gray-900">URL Crawler</h1>
          <div className="flex flex-row gap-2">
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/results"}>Results</NavLink>
          </div>
        </div>
      </header>
      <main className="px-6 py-8 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-200">
        © 2025 URL Crawler
      </footer>
    </div>
  );
};

export default Layout;
