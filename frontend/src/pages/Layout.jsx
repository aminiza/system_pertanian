import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  return (
    <React.Fragment>
      <div className="min-h-screen flex flex-col">
        <Sidebar
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <div>
          <Navbar
            sidebarToggle={sidebarToggle}
            setSidebarToggle={setSidebarToggle}
          />
          <main
            className={`flex-1 transition-all duration-300 ${sidebarToggle ? "lg:ml-0 md:ml-64" : "ml-64"}`}
          >
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"></div>
              {children}
              </div>
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
