import { useState } from "react";
import { Outlet } from "react-router-dom";
import { EmergencyRequestProvider } from "../../context/EmergencyRequestContext.jsx";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <EmergencyRequestProvider>
      <div className="min-h-screen bg-canvas lg:flex">
        <Sidebar onClose={() => setSidebarOpen(false)} open={sidebarOpen} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </EmergencyRequestProvider>
  );
}
