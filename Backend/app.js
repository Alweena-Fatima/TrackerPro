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
  // It now reads the initial value from localStorage or defaults to 'light'.
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode || 'light';
  });

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
  // State to hold the timeout IDs for scheduled browser notifications
  const [notificationTimers, setNotificationTimers] = useState({});

  // Function to toggle between light and dark mode
  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  // useEffect hook to save the theme to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  // useEffect hook to handle initial authentication and notification permission
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      fetchCompanies();
      // Request notification permission once the user is authenticated
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    } else {
      setLoading(false);
      setCurrView('user'); 
    }
  }, []);

  // ====================================================================
  // NOTIFICATION LOGIC
  // ====================================================================

  // Function to show a browser notification
  const showNotification = (company) => {
    if (Notification.permission === "granted") {
      new Notification("Application Deadline Reminder", {
        body: `Your deadline for ${company.role} at ${company.company} is approaching!`,
        icon: '/favicon.ico' // Optional: add an icon
      });
    }
  };

  // Function to schedule a notification for a specific company
  const scheduleNotification = (company) => {
    // First, clear any existing notification for this company to avoid duplicates
    cancelNotification(company._id);

    const deadline = new Date(company.deadline);
    const notificationTime = deadline.getTime() - (60 * 60 * 1000); // 1 hour before deadline
    const now = new Date().getTime();

    if (notificationTime > now) {
      const delay = notificationTime - now;
      const timerId = setTimeout(() => {
        showNotification(company);
      }, delay);

      setNotificationTimers(prev => ({ ...prev, [company._id]: timerId }));
    }
  };

  // Function to cancel a scheduled notification
  const cancelNotification = (companyId) => {
    if (notificationTimers[companyId]) {
      clearTimeout(notificationTimers[companyId]);
      setNotificationTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[companyId];
        return newTimers;
      });
    }
  };

  // ====================================================================
  // API & DATA HANDLING LOGIC
  // ====================================================================

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/companies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          handlelogout(); // Use the logout function to clear all state
          alert('Your session has expired. Please log in again.');
          return;
        }
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch companies');
      }
      
      const data = await res.json();
      setCompanies(data);
      // After fetching, schedule notifications for all upcoming deadlines
      data.forEach(company => scheduleNotification(company));
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
        res = await fetch(`${import.meta.env.VITE_API_URL}/companies/${companyData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(companyData),
        });
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/companies`, {
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
      
      scheduleNotification(savedCompany); // Schedule/reschedule notification
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/companies/${company._id}`, {
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
      cancelNotification(company._id); // Cancel notification on delete
    } catch (err) {
      console.error(err);
    }
  };

  const handlelogout = () => {
    // Clear all scheduled notifications on logout
    Object.values(notificationTimers).forEach(clearTimeout);
    setNotificationTimers({});

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
            {currView === "user" && <UserAuth mode={mode} onLoginSuccess={handleLoginSuccess} />}
            {currView === "about" && <AboutMe mode={mode}></AboutMe>}
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

