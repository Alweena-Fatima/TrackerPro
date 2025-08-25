import React, { useState } from "react";
import Card from "./component/Card.jsx";
import Sidebar from "./component/Sidebar.jsx";
import initialCompanies from "./data/CompanyData.js"; // import dummy data

function App() {
  const [companies, setCompanies] = useState(initialCompanies); // use imported data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:ml-72"> {/* Add left margin on desktop to account for fixed sidebar */}
        <div className="pt-4 lg:pt-8 px-4 lg:px-8">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
            {companies.map((company, index) => (
              <div key={index} className="w-full">
                <Card company={company} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {companies.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                  <span className="text-4xl">📋</span>
                </div>
                <h3 className="text-white font-mono text-xl font-bold mb-2">No Companies Found</h3>
                <p className="text-gray-400 font-mono text-sm">
                  <span className="text-cyan-400">$</span> Add your first company to get started
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