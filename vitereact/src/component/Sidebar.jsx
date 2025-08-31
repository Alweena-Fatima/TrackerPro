import React, { useState } from "react";
// Lucide-React se icons import kiye hain
import { Home, User, Plus, Info, Menu, X, Code, Moon, Sun, LogOut } from "lucide-react";

// Sidebar component jo app ka main navigation handle karta hai.
// Isko props milte hain jaise theme, view, authentication status aur user info.
function Sidebar({ mode, toggleMode, setCurrview, currView, isAuthenticated, onLogout, userid }) {
  // Mobile menu ke liye state: true ya false.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Yeh function navigation items par click hone par chalta hai.
  // Yeh `App.jsx` mein view state ko update karta hai.
  const handleItemClick = (itemId) => {
    setCurrview(itemId);
    setIsMobileMenuOpen(false); // Mobile menu ko band kar deta hai jab item par click ho.
  };

  // Mobile menu ko open/close karne ke liye function.
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Tailwind CSS classes ko mode ke hisaab se dynamically set kiya gaya hai.
  const bg = mode === "dark" ? "bg-gray-700" : "bg-gradient-to-br from-blue-50";
  const text = mode === "dark" ? "text-white" : "text-black";
  const border = mode === "dark" ? "border-gray-700" : "border-gray-200";
  const headerBg = mode === "dark" ? "bg-gray-800/50" : "bg-white";

  // Login status ke hisaab se menu items ko define karte hain.
  // Yeh user experience ko behtar banata hai.
  const loggedInMenuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "add", label: "Add Company", icon: Plus },
    { id: "about", label: "README.md", icon: Info },
  ];

  const loggedOutMenuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "user", label: "Login / Signup", icon: User },
    { id: "about", label: "README.md", icon: Info },
  ];

  // isAuthenticated state ke aadhar par sahi menu items ko choose karte hain.
  const menuItems = isAuthenticated ? loggedInMenuItems : loggedOutMenuItems;

  return (
    <>
      {/* Desktop Sidebar: yeh badi screens par dikhta hai. */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-72 ${bg} border-r ${border} shadow-lg overflow-hidden`}>
        <div className="relative z-10 flex flex-col h-full">
          {/* Header section */}
          <div className={`p-6 border-b ${border} ${headerBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className={`font-mono font-bold text-lg ${text}`}>TechPortal</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation section */}
          <nav className="flex-1 p-6 space-y-3">
            {/* User Info Section: login status ke hisaab se content change hota hai. */}
            <div className={`flex items-center space-x-4 p-4 rounded-lg border  ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} shadow-inner`}>
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${mode === "dark" ? "bg-blue-900 text-blue-400" : "bg-blue-200 text-blue-800"}`}>
                  {isAuthenticated && userid ? userid.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-mono text-xs ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {isAuthenticated ? "Logged in as:" : "Status:"}
                </p>
                <p className={`font-mono font-bold truncate ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {isAuthenticated && userid ? userid : "Guest"}
                </p>
              </div>
            </div>
            {/* Map ke through menu items ko render karte hain. */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${isActive
                      ? mode === "dark"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                        : "bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-md"
                      : mode === "dark"
                        ? "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50 hover:text-gray-300"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 shadow-sm"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <div className="font-mono text-m font-medium font-bold">{item.label}</div>
                  </div>
                </button>
              );
            })}
            {/* Logout button jo sirf authenticated users ko dikhta hai. */}
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${mode === "dark" ? 'bg-gray-800/50 text-red-400 border border-gray-700 hover:bg-red-900/50 hover:text-red-300' : 'bg-white text-red-600 border border-gray-200 hover:bg-red-50 hover:text-red-800 hover:border-red-300'}`}
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-4 h-4" />
                  <div className="font-mono text-m font-medium font-bold">Logout</div>
                </div>
              </button>
            )}
          </nav>

          {/* Footer section */}
          <div className={`p-5 border-t ${border} ${mode === "dark" ? "bg-black/50" : "bg-gray-100"}`}>
            <div className={`rounded-lg p-4 border ${border} ${mode === "dark" ? "bg-gray-800/50" : "bg-white"} shadow-inner`}>
              <div className="flex justify-between items-center font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <span className={mode === "dark" ? "text-cyan-400" : "text-cyan-600"}>MODE:</span>
                  <button
                    onClick={toggleMode}
                    className={`p-1 rounded-md transition-all duration-300 ${mode === "dark"
                        ? "hover:bg-yellow-400/20 text-yellow-400"
                        : "hover:bg-gray-200 text-gray-600"
                      }`}
                  >
                    {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
                <div className={mode === "dark" ? "text-gray-400" : "text-gray-500"}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Navigation: chhoti screens par dikhta hai. */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 ${headerBg} border-b ${border} shadow-md backdrop-blur-sm`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h1 className={`font-mono font-bold text-lg ${text}`}>TechPortal</h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMode}
              className={`p-2 rounded-lg transition-all duration-300 ${mode === "dark"
                  ? "hover:bg-yellow-400/20 text-yellow-400"
                  : "hover:bg-gray-200 text-gray-600"
                }`}
            >
              {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleMobileMenu}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${mode === "dark"
                  ? "bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/40"
                  : "bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu content jo tab dikhta hai jab `isMobileMenuOpen` true ho. */}
        {isMobileMenuOpen && (
          <div className={`border-t ${border} ${bg} backdrop-blur-sm shadow-lg`}>
            <div className="p-4 space-y-2">
              {/* User Info Section */}
              <div className={`flex items-center space-x-4 p-4 rounded-lg border  ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} shadow-inner`}>
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${mode === "dark" ? "bg-blue-900 text-blue-400" : "bg-blue-200 text-blue-800"}`}>
                    {isAuthenticated && userid ? userid.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-mono text-xs ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {isAuthenticated ? "Logged in as:" : "Status:"}
                  </p>
                  <p className={`font-mono font-bold truncate ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                    {isAuthenticated && userid ? userid : "Guest"}
                  </p>
                </div>
              </div>
              {/* Menu items jo map ke through render hote hain. */}
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${isActive
                        ? mode === "dark"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm"
                        : mode === "dark"
                          ? "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <div className="font-mono text-sm font-medium">{item.label}</div>
                    </div>
                  </button>
                );
              })}
              {/* Logout button mobile menu mein bhi dikhta hai. */}
              {isAuthenticated && (
                <button
                  onClick={onLogout}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${mode === "dark" ? 'bg-gray-800/50 text-red-400 border border-gray-700 hover:bg-red-900/50 hover:text-red-300' : 'bg-white text-red-600 border border-gray-200 hover:bg-red-50'}`}
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-4 h-4" />
                    <div className="font-mono text-sm font-medium">Logout</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Mobile devices par content ko sidebar ke neeche shift karne ke liye */}
      <div className="lg:hidden h-20" />
    </>
  );
}

export default Sidebar;