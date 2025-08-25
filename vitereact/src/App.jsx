import React, { useState } from "react";
import Card from "./component/Card.jsx";
import Sidebar from "./component/Sidebar.jsx";
import initialCompanies from "./data/CompanyData.js"; // import dummy data

function App() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [mode, setMode] = useState("dark"); // store theme in App

  // function to toggle theme
  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black"
      }`}
    >
      {/* Sidebar gets mode + toggle function */}
      <Sidebar mode={mode} toggleMode={toggleMode} />

      {/* Main Content Area */}
      <div className="lg:ml-72">
        <div className="pt-4 lg:pt-8 px-4 lg:px-8">
          {/* Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
            {companies.map((company, index) => (
              <div key={index} className="w-full">
                <Card company={company} mode={mode} />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {companies.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-4 border ${
                    mode === "dark"
                      ? "bg-gray-800 border-cyan-500/20"
                      : "bg-gray-200 border-cyan-500/40"
                  }`}
                >
                  <span className="text-4xl">📋</span>
                </div>
                <h3
                  className={`font-mono text-xl font-bold mb-2 ${
                    mode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  No Companies Found
                </h3>
                <p
                  className={`font-mono text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <span className="text-cyan-400">$</span> Add your first company
                  to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
