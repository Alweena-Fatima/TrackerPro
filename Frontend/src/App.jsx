// App.jsx
import React, { useState, useEffect } from "react";
import CompanyCard from "./component/Card.jsx";
import Sidebar from "./component/Sidebar.jsx";
import AddCard from "./component/Addcard.jsx";
import UserAuth from "./component/User.jsx";
import AboutMe from "./component/AboutMe.jsx";

// ====================================================================
// MAIN APPLICATION COMPONENT
// This component manages the overall state and view of the application.
// ====================================================================
function App() {
  // State for storing the list of all companies
  const [companies, setCompanies] = useState([]);
  // State to control the application's theme (light/dark mode)
  const [mode, setMode] = useState("light");
  // State to determine which component is currently visible (home, add, user, about)
  const [currView, setCurrView] = useState("home");
  // State to track the user's authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to show/hide a loading indicator while fetching data
  const [loading, setLoading] = useState(true);
  // State to store the authenticated user's data
  const [user, setUser] = useState(null);
  // State to hold the company data when a user clicks the edit button
  const [companyToEdit, setCompanyToEdit] = useState(null);

  // Function to toggle between light and dark mode
  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  // useEffect hook to handle initial authentication check on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      fetchCompanies();
    } else {
      setLoading(false);
      // If not authenticated on first load, default to the user auth page
      setCurrView('user'); 
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
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
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

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setCurrView('home');
    fetchCompanies();
  };

  const handleAddCompany = async (companyData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      let res;
      if (companyData._id) {
        res = await fetch(`http://localhost:3000/companies/${companyData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(companyData),
        });
      } else {
        res = await fetch("http://localhost:3000/companies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(companyData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save company");
      }

      const savedCompany = await res.json();
      
      if (companyData._id) {
        setCompanies(companies.map(c => c._id === savedCompany._id ? savedCompany : c));
      } else {
        setCompanies(prev => [...prev, savedCompany]);
      }
      
      setCompanyToEdit(null);
      setCurrView("home");
      alert("Company saved successfully!");

    } catch (err) {
      console.error("Error saving company:", err);
      alert("Error saving company. Please try again.");
    }
  };

  const handleCancelAdd = () => {
    setCompanyToEdit(null);
    setCurrView("home");
  };

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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Delete failed");
      }

      setCompanies(companies.filter(c => c._id !== company._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handlelogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCompanies([]);
    setCurrView('user');
  };

  const handleEditCompany = (companyData) => {
    setCompanyToEdit(companyData);
    setCurrView("add");
  };

  // Main render function based on authentication and current view
  return (
    <div className={`min-h-screen transition-colors duration-500 ${mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Sidebar
        mode={mode}
        toggleMode={toggleMode}
        currView={currView}
        setCurrview={setCurrView}
        isAuthenticated={isAuthenticated}
        userid={user?.userid || "Guest"}
        onLogout={handlelogout}
      />
      
      <div className="lg:ml-72 pt-4 lg:pt-8 px-4 lg:px-8">
        {/*
          Conditional Rendering:
          1. Show UserAuth if the user is not authenticated and the view is 'user'.
          2. Show AboutMe if the view is 'about' (it's a public page).
          3. If authenticated, show protected views like 'home' and 'add'.
        */}
        {isAuthenticated ? (
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
                      onEdit={handleEditCompany}
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
                editingCompany={companyToEdit}
              />
            )}
            {currView === "about" && <AboutMe mode={mode}></AboutMe>}
          </>
        ) : (
          <>
            {/* Show UserAuth by default for unauthenticated users */}
            {currView === "user" && <UserAuth mode={mode} onLoginSuccess={handleLoginSuccess} />}
            {/* Allow access to the About page even when not logged in */}
            {currView === "about" && <AboutMe mode={mode}></AboutMe>}

            {/* When not logged in, we can show a welcome message on the home page */}
            {currView === "home" && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center p-8 border rounded-xl shadow-lg">
                        <h2 className={`font-mono text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Welcome to TechPortal!
                        </h2>
                        <p className={`mt-4 font-mono ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Please log in or sign up to start tracking your job applications.
                        </p>
                        <button
                            onClick={() => setCurrView('user')}
                            className={`mt-6 px-6 py-3 rounded-md font-mono text-sm font-bold transition-all duration-200 ${mode === "dark" ? "bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30" : "bg-blue-100/80 hover:bg-blue-200/80 text-blue-700 border border-blue-300"}`}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;