import React from "react";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-dvh bg-gray-50 text-gray-800 flex flex-col gap-4">
      <Header />
      <main className="px-6 py-8 flex-1 overflow-y-auto">{children}</main>
      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-200">
        © 2025 URL Crawler
      </footer>
    </div>
  );
};

export default Layout;
