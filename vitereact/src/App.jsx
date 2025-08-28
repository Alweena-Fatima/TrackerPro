import React, { useState, useEffect } from "react";
import CompanyCard from "./component/Card.jsx";
import Sidebar from "./component/Sidebar.jsx";
import AddCard from "./component/AddCard.jsx";
import UserAuth from "./component/User.jsx";

function App() {
  const [companies, setCompanies] = useState([]);
  const [mode, setMode] = useState("dark");
  const [currView, setCurrView] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchCompanies();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No token found. Please log in.");
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/companies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setCurrView('user');
            alert('Your session has expired. Please log in again.');
            return;
        }
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch companies');
      }
      
      const data = await res.json();
      setCompanies(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrView('home');
    fetchCompanies();
  };

  const handleAddCompany = async (newCompany) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/addCompany", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newCompany),
      });

      if (!res.ok) {
        throw new Error("Failed to add company");
      }

      const savedCompany = await res.json();
      setCompanies((prev) => [...prev, savedCompany]);
      setCurrView("home");

    } catch (err) {
      console.error("Error adding company:", err);
    }
  };

  const handleCancelAdd = () => setCurrView("home");
  
  const handleDelete = async (company) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3000/companies/${company._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setCompanies(companies.filter(c => c._id !== company._id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Sidebar
        mode={mode}
        toggleMode={toggleMode}
        CurrView={currView}
        setCurrview={setCurrView}
      />
      
      <div className="lg:ml-72 pt-4 lg:pt-8 px-4 lg:px-8">
        {!isAuthenticated ? (
            <UserAuth mode={mode} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {currView === "home" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
                {loading ? (
                    <div className="text-center font-mono">Loading...</div>
                ) : companies.length > 0 ? (
                  companies.map((company) => (
                    <CompanyCard
                      key={company._id}
                      company={company}
                      mode={mode}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <div className={`w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-4 border ${mode === "dark" ? "bg-gray-800 border-cyan-500/20" : "bg-gray-200 border-cyan-500/40"}`}>
                        <span className="text-4xl">📋</span>
                      </div>
                      <h3 className={`font-mono text-xl font-bold mb-2 ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                        No Companies Found
                      </h3>
                      <p className={`font-mono text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        <span className="text-cyan-400">$</span> Add your first company to get started
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {currView === "add" && (
              <AddCard
                mode={mode}
                onAdd={handleAddCompany}
                onCancel={handleCancelAdd}
              />
            )}
            {currView === "user" && <UserAuth mode={mode} onLoginSuccess={handleLoginSuccess} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;