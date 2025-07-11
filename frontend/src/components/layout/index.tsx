import React from "react";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen bg-gray-100 text-gray-800 flex flex-col gap-4">
      <Header />
      <main className="px-4 flex-1 overflow-y-auto">{children}</main>
      <footer className="text-center text-sm text-gray-500 py-6 bg-white border-t border-gray-200">
        URL Crawler, Copyright © 2025, All rights reserved
      </footer>
    </div>
  );
};

export default Layout;
