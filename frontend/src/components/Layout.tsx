import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-dvh bg-gray-50 text-gray-800 flex flex-col gap-4">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">URL Crawler</h1>
        </div>
      </header>
      <main className="px-6 py-8 flex-1">{children}</main>
      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-200">
        © 2025 URL Crawler
      </footer>
    </div>
  );
};

export default Layout;
