import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white ">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Fixed height Header */}
        <div className="h-16">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        

        {/* Main grows to fill remaining space */}
        {/* <main className="flex-1 px-0 sm:px-4 md:px-6 py-7 bg-white overflow-y-auto scrollbar-hide"> */}
        <main className="flex-1 px-4 md:px-6 py-7 bg-white overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
