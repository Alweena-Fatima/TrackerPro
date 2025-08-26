import React, { useState, useEffect } from "react";
import CompanyCard from "./component/Card.jsx";
import Sidebar from "./component/Sidebar.jsx";
import AddCard from "./component/AddCard.jsx";

function App() {
  const [companies, setCompanies] = useState([]);
  const [mode, setMode] = useState("dark");
  const [currView, setCurrView] = useState("home");

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  // Fetch companies from backend
  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:3000/companies"); // exactly this
      if (!res.ok) throw new Error("Failed to fetch companies");
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };


  useEffect(() => {
    fetchCompanies();
  }, []);

  // Add a new company
  const handleAddCompany = async (newCompany) => {
    try {
      const res = await fetch("http://localhost:3000/addCompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany),
      });
      if (!res.ok) throw new Error("Failed to add company");
      const savedCompany = await res.json();
      setCompanies((prev) => [...prev, savedCompany]);
      setCurrView("home");
    } catch (err) {
      console.error("Error adding company:", err);
    }
  };

  const handleCancelAdd = () => setCurrView("home");

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
    >
      <Sidebar
        mode={mode}
        toggleMode={toggleMode}
        CurrView={currView}
        setCurrview={setCurrView}
      />

      <div className="lg:ml-72 pt-4 lg:pt-8 px-4 lg:px-8">
        {currView === "home" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
            {companies.length > 0 ? (
              companies.map((company) => (
                <CompanyCard
                  key={company._id}
                  company={company}
                  mode={mode}
                />
              ))
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div
                    className={`w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-4 border ${mode === "dark"
                        ? "bg-gray-800 border-cyan-500/20"
                        : "bg-gray-200 border-cyan-500/40"
                      }`}
                  >
                    <span className="text-4xl">📋</span>
                  </div>
                  <h3
                    className={`font-mono text-xl font-bold mb-2 ${mode === "dark" ? "text-white" : "text-gray-900"
                      }`}
                  >
                    No Companies Found
                  </h3>
                  <p
                    className={`font-mono text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    <span className="text-cyan-400">$</span> Add your first
                    company to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {currView === "add" && (
          <AddCard mode={mode} onAdd={handleAddCompany} onCancel={handleCancelAdd} />
        )}
      </div>
    </div>
  );
}

export default App;
